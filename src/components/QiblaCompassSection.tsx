import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  MapPin, 
  Navigation, 
  RotateCw, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  Info,
  Maximize2,
  Globe
} from 'lucide-react';
import { 
  calculateQiblaBearing, 
  calculateDistanceToKaaba, 
  getAngularDifference, 
  normalizeAngle,
  DEFAULT_CITIES,
  KAABA_COORDINATES
} from '../utils/qibla';

export const QiblaCompassSection: React.FC = () => {
  // Coordinates and Location state (Default to UPIC Limo, Depok)
  const [currentCityName, setCurrentCityName] = useState<string>('Depok (UPIC Limo)');
  const [latitude, setLatitude] = useState<number>(-6.3687);
  const [longitude, setLongitude] = useState<number>(106.7788);
  const [isUsingGps, setIsUsingGps] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Compass and Sensor state
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [sensorActive, setSensorActive] = useState<boolean>(false);
  const [sensorType, setSensorType] = useState<'magnetometer' | 'deviceorientation' | 'manual'>('manual');
  const [sensorStatusMsg, setSensorStatusMsg] = useState<string>('Sensor belum aktif. Klik tombol aktifkan atau gunakan simulasi putar.');
  const [needsPermissionPrompt, setNeedsPermissionPrompt] = useState<boolean>(false);

  // Manual rotation mode for desktop/testing
  const [manualHeading, setManualHeading] = useState<number>(295);

  // Calculate target Qibla bearing and distance from coordinates
  const qiblaBearing = calculateQiblaBearing(latitude, longitude);
  const distanceKm = calculateDistanceToKaaba(latitude, longitude);

  // Active heading is from sensor if active, else from manual control
  const activeHeading = sensorActive ? deviceHeading : manualHeading;
  
  // Calculate difference to Kaaba
  const angularDiff = getAngularDifference(activeHeading, qiblaBearing);
  const isAligned = Math.abs(angularDiff) <= 3; // within 3 degrees tolerance

  // Haptic feedback trigger on alignment lock
  const hasVibratedRef = useRef(false);
  useEffect(() => {
    if (isAligned && !hasVibratedRef.current) {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([60, 40, 60]);
        } catch (_) {}
      }
      hasVibratedRef.current = true;
    } else if (!isAligned) {
      hasVibratedRef.current = false;
    }
  }, [isAligned]);

  // Request Magnetometer / DeviceOrientation setup
  const initCompassSensors = async () => {
    setGpsError(null);

    // 1. Try iOS Safari DeviceOrientation permission
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceOrientationEvent as any) !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          attachOrientationListener();
          return;
        } else {
          setSensorStatusMsg('Izin akses orientasi perangkat ditolak.');
          return;
        }
      } catch (err: any) {
        console.warn('Orientation permission error:', err);
      }
    }

    // 2. Try Generic Sensor API: Magnetometer
    let magnetometerStarted = false;
    if (typeof window !== 'undefined' && 'Magnetometer' in window) {
      try {
        const MagnetometerClass = (window as any).Magnetometer;
        const magSensor = new MagnetometerClass({ frequency: 30 });
        
        magSensor.addEventListener('reading', () => {
          // Compute heading from x and y magnetic flux (in microteslas)
          const headingRad = Math.atan2(magSensor.y, magSensor.x);
          let headingDeg = (headingRad * 180) / Math.PI;
          headingDeg = normalizeAngle(headingDeg);
          setDeviceHeading(Math.round(headingDeg));
          setSensorActive(true);
          setSensorType('magnetometer');
          setSensorStatusMsg('Sensor Magnetometer perangkat aktif.');
        });

        magSensor.addEventListener('error', (event: any) => {
          console.warn('Magnetometer sensor error:', event.error);
          // Fallback to Device Orientation
          attachOrientationListener();
        });

        magSensor.start();
        magnetometerStarted = true;
        return;
      } catch (e) {
        console.warn('Generic Sensor Magnetometer initiation error:', e);
      }
    }

    // 3. Fallback to standard DeviceOrientation absolute
    if (!magnetometerStarted) {
      attachOrientationListener();
    }
  };

  const attachOrientationListener = () => {
    let handled = false;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      let compassHeading: number | null = null;

      // iOS Safari provides webkitCompassHeading directly relative to magnetic north
      if ((e as any).webkitCompassHeading !== undefined && (e as any).webkitCompassHeading !== null) {
        compassHeading = (e as any).webkitCompassHeading;
      } else if (e.alpha !== null && e.alpha !== undefined) {
        // Standard Android/Chrome device orientation (alpha is rotation around z)
        // If absolute is supported or alpha is available
        compassHeading = 360 - e.alpha;
      }

      if (compassHeading !== null) {
        const normalized = Math.round(normalizeAngle(compassHeading));
        setDeviceHeading(normalized);
        setSensorActive(true);
        setSensorType('deviceorientation');
        setSensorStatusMsg('Sensor orientasi kompas perangkat aktif.');
        handled = true;
      }
    };

    const win = window as any;
    if ('ondeviceorientationabsolute' in win) {
      win.addEventListener('deviceorientationabsolute', handleOrientation, true);
    } else if ('ondeviceorientation' in win) {
      win.addEventListener('deviceorientation', handleOrientation, true);
    }

    // Timeout check if hardware actually reports data
    setTimeout(() => {
      if (!handled) {
        setSensorStatusMsg('Perangkat tidak mendeteksi chip magnetometer perangkat keras. Mode kompas manual aktif.');
      }
    }, 1500);
  };

  // Get real GPS coordinates
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation tidak didukung oleh browser Anda.');
      return;
    }

    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        setIsUsingGps(true);
        setCurrentCityName(`Koordinat GPS (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`);
      },
      (error) => {
        setGpsError(`Gagal membaca GPS: ${error.message}. Anda tetap dapat memilih kota dari daftar.`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSelectCity = (city: typeof DEFAULT_CITIES[0]) => {
    setLatitude(city.latitude);
    setLongitude(city.longitude);
    setCurrentCityName(`${city.city}, ${city.country}`);
    setIsUsingGps(false);
    setGpsError(null);
  };

  // Cardinal direction text
  const getCardinalName = (deg: number): string => {
    const val = normalizeAngle(deg);
    if (val >= 337.5 || val < 22.5) return 'Utara (N)';
    if (val >= 22.5 && val < 67.5) return 'Timur Laut (NE)';
    if (val >= 67.5 && val < 112.5) return 'Timur (E)';
    if (val >= 112.5 && val < 157.5) return 'Tenggara (SE)';
    if (val >= 157.5 && val < 202.5) return 'Selatan (S)';
    if (val >= 202.5 && val < 247.5) return 'Barat Daya (SW)';
    if (val >= 247.5 && val < 292.5) return 'Barat (W)';
    return 'Barat Laut (NW)';
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title & Quranic Foundation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-emerald-400" />
            <span>Kompas Kiblat Presisi Magnetometer Digital</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Penunjuk arah Ka'bah (Masjidil Haram, Makkah) akurat menggunakan sensor magnetometer dan koordinat geodesi bumi.
          </p>
        </div>

        {/* Quick GPS Button */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleGetLocation}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{isUsingGps ? 'GPS Aktif' : 'Gunakan GPS Lokasi Saya'}</span>
          </button>
        </div>
      </div>

      {gpsError && (
        <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Main Compass and Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Visual Compass Dial (7 cols) */}
        <div className="lg:col-span-7 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-between shadow-2xl relative overflow-hidden">
          {/* Subtle Islamic lattice glow backdrop */}
          <div className="absolute inset-0 bg-radial from-emerald-500/5 via-transparent to-transparent pointer-events-none" />

          {/* Heading Info Top Strip */}
          <div className="w-full flex items-center justify-between text-xs pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${sensorActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-slate-300 font-medium">
                {sensorActive ? `Sensor: ${sensorType === 'magnetometer' ? 'Magnetometer' : 'Orientasi Device'}` : 'Mode Manual / Simulasi'}
              </span>
            </div>

            <div className="text-slate-400 font-mono tabular-nums">
              Arah HP: <strong className="text-white text-sm">{activeHeading}°</strong> ({getCardinalName(activeHeading)})
            </div>
          </div>

          {/* Large Compass Rose Container */}
          <div className="relative my-8 flex items-center justify-center">
            {/* Outer Decorative Ring */}
            <div className={`w-72 h-72 sm:w-84 sm:h-84 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              isAligned 
                ? 'border-amber-400 shadow-[0_0_40px_rgba(234,179,8,0.35)] bg-emerald-950/20' 
                : 'border-slate-800 bg-slate-950/60 shadow-inner'
            }`}>
              
              {/* Compass Dial Rotating Face (rotates with negative device heading so North stays North) */}
              <div 
                className="w-64 h-64 sm:w-76 sm:h-76 rounded-full relative transition-transform duration-200 ease-out flex items-center justify-center select-none"
                style={{ transform: `rotate(${-activeHeading}deg)` }}
              >
                {/* Cardinal Points */}
                <div className="absolute top-2 text-xs font-black text-red-500 tracking-wider">N</div>
                <div className="absolute bottom-2 text-xs font-bold text-slate-400 tracking-wider">S</div>
                <div className="absolute right-2 text-xs font-bold text-slate-400 tracking-wider">E</div>
                <div className="absolute left-2 text-xs font-bold text-slate-400 tracking-wider">W</div>

                {/* Dial Tick marks circle */}
                <div className="absolute inset-4 rounded-full border border-dashed border-slate-700/60" />

                {/* Intercardinal Labels */}
                <div className="absolute top-6 right-6 text-[9px] font-mono text-slate-600">NE</div>
                <div className="absolute bottom-6 right-6 text-[9px] font-mono text-slate-600">SE</div>
                <div className="absolute bottom-6 left-6 text-[9px] font-mono text-slate-600">SW</div>
                <div className="absolute top-6 left-6 text-[9px] font-mono text-slate-600">NW</div>

                {/* The Qibla Kaaba Needle / Vector Pinpoint */}
                <div 
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{ transform: `rotate(${qiblaBearing}deg)` }}
                >
                  {/* Needle line pointing from center to edge towards Kaaba */}
                  <div className="relative w-full flex items-center justify-center">
                    {/* Golden Kaaba Pointer Head */}
                    <div className="absolute top-1 flex flex-col items-center">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-b from-amber-400 to-amber-600 shadow-lg shadow-amber-500/50 flex items-center justify-center text-slate-950 border border-white/60">
                        {/* Kaaba Symbol Icon */}
                        <div className="w-3.5 h-3.5 bg-slate-950 rounded-xs border-t-2 border-amber-300" />
                      </div>
                      <span className="text-[9px] font-bold text-amber-300 mt-1 uppercase tracking-wider drop-shadow-sm">
                        Ka'bah
                      </span>
                    </div>

                    {/* Beam toward Kaaba */}
                    <div className="w-0.5 h-28 bg-gradient-to-t from-transparent via-amber-400/60 to-amber-400 absolute top-7" />
                  </div>
                </div>

                {/* Dial Crosshair Center */}
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center shadow-lg z-10">
                  <div className={`w-3 h-3 rounded-full transition-colors ${isAligned ? 'bg-amber-400 animate-ping' : 'bg-emerald-500'}`} />
                </div>
              </div>

              {/* Fixed Top Index Pointer (Represents where the user's phone / eyes are pointing) */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20">
                <div className={`w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] ${
                  isAligned ? 'border-t-amber-400' : 'border-t-emerald-400'
                }`} />
              </div>
            </div>
          </div>

          {/* Alignment Banner Status */}
          <div className="w-full">
            {isAligned ? (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/80 via-amber-950/60 to-emerald-950/80 border border-amber-400/60 text-center space-y-1 shadow-lg animate-pulse">
                <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-amber-400" />
                  <span>TEPAT MENGHADAP KIBLAT (AL-KA'BAH)</span>
                </div>
                <p className="text-xs text-slate-200">
                  Allahu Akbar. Posisi perangkat Anda telah selaras lurus dengan Ka'bah di Makkah.
                </p>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-slate-300 font-bold text-xs">
                  <RotateCw className="w-4 h-4 text-emerald-400" />
                  <span>
                    {angularDiff > 0 
                      ? `Putar perangkat ke Kanan sebesar ${Math.abs(Math.round(angularDiff))}°` 
                      : `Putar perangkat ke Kiri sebesar ${Math.abs(Math.round(angularDiff))}°`
                    }
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono tabular-nums">
                  Arah Kiblat target: <strong className="text-emerald-300">{qiblaBearing.toFixed(1)}°</strong> (Selisih {Math.abs(Math.round(angularDiff))}°)
                </p>
              </div>
            )}
          </div>

          {/* Sensor Activation and Manual Simulator Controls */}
          <div className="w-full pt-4 mt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <button
              onClick={initCompassSensors}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                sensorActive
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>{sensorActive ? 'Sensor Kompas Aktif' : 'Aktifkan Sensor Magnetometer'}</span>
            </button>

            {/* Manual test slider (always helpful for desktop testing or calibration) */}
            <div className="w-full sm:w-auto flex-1 sm:max-w-xs flex items-center gap-2">
              <span className="text-[11px] text-slate-400 whitespace-nowrap">Simulasi Putar:</span>
              <input
                type="range"
                min="0"
                max="360"
                value={activeHeading}
                onChange={(e) => {
                  setSensorActive(false);
                  setManualHeading(Number(e.target.value));
                }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <span className="font-mono text-[11px] text-slate-200 w-9 text-right tabular-nums">
                {activeHeading}°
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Qibla Geodesy & City Presets (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
          {/* Geodesy Calculation Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                Parameter Geodesi Kiblat
              </span>
              <span className="text-[11px] text-slate-400 font-mono">True North</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">Lokasi Acuan Anda:</span>
                <strong className="text-white text-sm block">{currentCityName}</strong>
                <span className="text-[11px] font-mono text-slate-400">
                  Lat: {latitude.toFixed(4)}° · Lng: {longitude.toFixed(4)}°
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">DERAJAT KIBLAT:</span>
                  <strong className="text-amber-300 text-base font-bold tabular-nums">
                    {qiblaBearing.toFixed(2)}°
                  </strong>
                  <span className="text-[10px] text-slate-500 block">Dari Utara Sejati</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">JARAK KE KA'BAH:</span>
                  <strong className="text-emerald-400 text-base font-bold tabular-nums">
                    {distanceKm.toLocaleString('id-ID')} km
                  </strong>
                  <span className="text-[10px] text-slate-500 block">Garis Lurus Bumi</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/30 text-slate-300 space-y-1 text-xs">
                <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Target Titik Suci Ka'bah:</span>
                </div>
                <div className="text-[11px] text-slate-300">
                  21.4225° LU, 39.8262° BT · Makkah Al-Mukarramah
                </div>
              </div>
            </div>
          </div>

          {/* Quick City Presets */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pilih Kota / Wilayah Lain</span>
            </h4>
            
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {DEFAULT_CITIES.map((c) => {
                const isSelected = currentCityName.includes(c.city);
                return (
                  <button
                    key={c.city}
                    onClick={() => handleSelectCity(c)}
                    className={`py-2 px-2.5 rounded-lg text-left text-xs transition-colors flex flex-col ${
                      isSelected
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-bold'
                        : 'bg-slate-950/70 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{c.city}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {calculateQiblaBearing(c.latitude, c.longitude).toFixed(1)}°
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quranic Verse Box */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <p className="font-arabic text-right text-base text-amber-200/90 leading-loose">
              فَوَلِّ وَجْهَكَ شَطْرَ الْمَسْجِدِ الْحَرَامِ ۚ وَحَيْثُ مَا كُنتُمْ فَوَلُّوا وُجُوهَكُمْ شَطْرَهُ
            </p>
            <p className="text-[11px] text-slate-400 italic">
              "Palingkanlah mukamu ke arah Masjidil Haram. Dan di mana saja kamu berada, palingkanlah mukamu ke arahnya." (QS. Al-Baqarah [2]: 144)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
