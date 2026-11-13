import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  useMapsLibrary,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  APILoadingStatus,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  Search,
  LocateFixed,
  Compass,
  Clock,
  Star,
  ExternalLink,
  CheckCircle2,
  Bookmark,
  Route as RouteIcon,
  Car,
  Footprints,
  Bike,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Building2,
  X,
} from 'lucide-react';
import { DiscoveredMosque } from '../types/islamicity';
import { DEFAULT_CITIES } from '../utils/qibla';

const AFFILIATED_STORAGE_KEY = 'islamicity_affiliated_mosque_ids';
const ATTRIBUTION_ID = 'gmp_mcp_codeassist_v1_aistudio';

type TravelModeOption = 'DRIVING' | 'WALKING' | 'TWO_WHEELER';
type FilterMode = 'all' | 'affiliated' | 'top_rated';

interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface ActiveRouteInfo {
  mosqueId: string;
  mosqueName: string;
  distanceMeters: number;
  durationMillis: number;
  travelMode: TravelModeOption;
}

function isQuotaError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return (
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('OVER_QUERY_LIMIT') ||
    msg.includes('429') ||
    msg.includes('QuotaExceeded') ||
    msg.includes('OverQuotaMapError')
  );
}

function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
}

function formatDuration(ms: number): string {
  const mins = Math.max(1, Math.round(ms / 60000));
  if (mins < 60) return `${mins} menit`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${hrs} jam ${rem} mnt` : `${hrs} jam`;
}

function haversineMeters(a: LatLngLiteral, b: LatLngLiteral): number {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const c =
    sinLat * sinLat +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      sinLng *
      sinLng;
  return R * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c));
}

// ============================================================================
// Sub-component: Area Autocomplete Search (Places API New - AutocompleteSuggestion)
// ============================================================================
interface AreaSearchInputProps {
  onLocationSelected: (coords: LatLngLiteral, label: string) => void;
}

const AreaSearchInput: React.FC<AreaSearchInputProps> = ({ onLocationSelected }) => {
  const placesLib = useMapsLibrary('places');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompleteSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!placesLib || !query.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { AutocompleteSessionToken, AutocompleteSuggestion } = placesLib;
        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new AutocompleteSessionToken();
        }
        setIsSearching(true);
        const res = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: query.trim(),
          sessionToken: sessionTokenRef.current,
          language: 'id',
          region: 'id',
        });
        setSuggestions(res.suggestions ?? []);
        setIsOpen(true);
      } catch (err) {
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [placesLib, query]);

  const handleSelectSuggestion = async (
    suggestion: google.maps.places.AutocompleteSuggestion
  ) => {
    if (!placesLib || !suggestion.placePrediction) return;
    try {
      const place = suggestion.placePrediction.toPlace();
      await place.fetchFields({
        fields: ['displayName', 'formattedAddress', 'location'],
      });
      if (place.location) {
        const coords = {
          lat: place.location.lat(),
          lng: place.location.lng(),
        };
        const label =
          place.displayName ||
          place.formattedAddress ||
          suggestion.placePrediction.text.text;
        onLocationSelected(coords, label);
        setQuery(label);
      }
    } catch (err) {
      if (isQuotaError(err)) {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
      }
    } finally {
      sessionTokenRef.current = null;
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1 min-w-[220px]">
      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (!e.target.value) setIsOpen(false);
        }}
        onFocus={() => {
          if (suggestions.length > 0) setIsOpen(true);
        }}
        placeholder="Cari wilayah, kecamatan, atau kota..."
        aria-label="Cari lokasi wilayah masjid"
        className="w-full pl-9 pr-8 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
      />
      {isSearching && (
        <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
      )}
      {!isSearching && query && (
        <button
          type="button"
          onClick={() => {
            setQuery('');
            setSuggestions([]);
            setIsOpen(false);
          }}
          aria-label="Hapus pencarian wilayah"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden divide-y divide-slate-800 max-h-60 overflow-y-auto">
          {suggestions.map((item, idx) => (
            <li key={item.placePrediction?.placeId || idx}>
              <button
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="w-full text-left px-3 py-2.5 text-xs text-slate-200 hover:bg-slate-800 flex items-start gap-2 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{item.placePrediction?.text.text}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ============================================================================
// Sub-component: Mosque AdvancedMarker with anchored InfoWindow
// ============================================================================
interface MosqueMarkerProps {
  mosque: DiscoveredMosque;
  isSelected: boolean;
  isAffiliated: boolean;
  onSelect: (mosque: DiscoveredMosque) => void;
  onCloseInfo: () => void;
  onRequestRoute: (mosque: DiscoveredMosque) => void;
  onToggleAffiliated: (mosqueId: string) => void;
}

const MosqueMarkerItem: React.FC<MosqueMarkerProps> = ({
  mosque,
  isSelected,
  isAffiliated,
  onSelect,
  onCloseInfo,
  onRequestRoute,
  onToggleAffiliated,
}) => {
  const [markerRef, marker] = useAdvancedMarkerRef();

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={mosque.location}
        title={mosque.displayName}
        zIndex={isSelected ? 50 : isAffiliated ? 30 : 10}
        onClick={() => onSelect(mosque)}
      >
        <Pin
          background={isSelected ? '#f59e0b' : isAffiliated ? '#10b981' : '#065f46'}
          borderColor={isSelected ? '#fef3c7' : isAffiliated ? '#a7f3d0' : '#34d399'}
          glyphColor={isSelected ? '#0f172a' : '#ffffff'}
          scale={isSelected ? 1.25 : isAffiliated ? 1.1 : 1.0}
        />
      </AdvancedMarker>

      {isSelected && marker && (
        <InfoWindow
          anchor={marker}
          maxWidth={290}
          onCloseClick={onCloseInfo}
        >
          <div className="p-1 text-slate-900 space-y-2">
            <div>
              <div className="text-[11px] font-semibold text-emerald-700">
                {isAffiliated ? 'Mitra Jaringan Islamicity' : 'Masjid Terdekat'} ·{' '}
                <span className="tabular-nums">{formatDistance(mosque.distanceMeters)}</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 leading-snug mt-0.5">
                {mosque.displayName}
              </h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {mosque.formattedAddress}
            </p>

            <div className="flex items-center gap-2 text-[11px] text-slate-600 tabular-nums">
              {mosque.rating !== undefined && (
                <span className="font-semibold text-amber-700">
                  ★ {mosque.rating.toFixed(1)} ({mosque.userRatingCount ?? 0})
                </span>
              )}
              {mosque.businessStatus === 'OPERATIONAL' && (
                <>
                  <span>·</span>
                  <span className="text-emerald-700 font-medium">Aktif</span>
                </>
              )}
            </div>

            <div className="pt-1.5 border-t border-slate-200 flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => onRequestRoute(mosque)}
                className="px-2.5 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold transition-colors"
              >
                Rute di Peta
              </button>
              <button
                type="button"
                onClick={() => onToggleAffiliated(mosque.id)}
                className="px-2.5 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold border border-slate-300 transition-colors"
              >
                {isAffiliated ? 'Hapus Mitra' : 'Tandai Mitra'}
              </button>
              {mosque.googleMapsURI && (
                <a
                  href={mosque.googleMapsURI}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-md text-emerald-800 hover:underline text-[11px] font-semibold inline-flex items-center gap-1"
                >
                  <span>Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

// ============================================================================
// Sub-component: Controller inside <APIProvider> & <GoogleMap>
// Handles Place.searchNearby, Route.computeRoutes, and Map Camera Panning
// ============================================================================
interface MapServicesControllerProps {
  center: LatLngLiteral;
  radiusMeters: number;
  searchTrigger: number;
  routeTarget: DiscoveredMosque | null;
  travelMode: TravelModeOption;
  onMosquesLoaded: (mosques: DiscoveredMosque[]) => void;
  onLoadingChange: (loading: boolean) => void;
  onError: (msg: string | null) => void;
  onRouteComputed: (info: ActiveRouteInfo | null) => void;
  onRouteLoadingChange: (loading: boolean) => void;
}

const MapServicesController: React.FC<MapServicesControllerProps> = ({
  center,
  radiusMeters,
  searchTrigger,
  routeTarget,
  travelMode,
  onMosquesLoaded,
  onLoadingChange,
  onError,
  onRouteComputed,
  onRouteLoadingChange,
}) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const routesLib = useMapsLibrary('routes');
  const geometryLib = useMapsLibrary('geometry');
  const coreLib = useMapsLibrary('core');

  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  // Pan map smoothly when center changes
  useEffect(() => {
    if (!map) return;
    map.panTo(center);
  }, [map, center.lat, center.lng]);

  // Execute Place.searchNearby for mosques near user's coordinates
  useEffect(() => {
    if (!placesLib || !map) return;

    let cancelled = false;
    const runSearch = async () => {
      onLoadingChange(true);
      onError(null);
      try {
        const clampedRadius = Math.min(Math.max(radiusMeters, 500), 50000);
        const request: google.maps.places.SearchNearbyRequest = {
          fields: [
            'id',
            'displayName',
            'location',
            'formattedAddress',
            'businessStatus',
            'googleMapsURI',
            'rating',
            'userRatingCount',
          ],
          locationRestriction: {
            center,
            radius: clampedRadius,
          },
          includedPrimaryTypes: ['mosque'],
          maxResultCount: 15,
          rankPreference: placesLib.SearchNearbyRankPreference.DISTANCE,
          language: 'id',
          region: 'id',
          internalUsageAttributionIds: [ATTRIBUTION_ID],
        } as google.maps.places.SearchNearbyRequest & {
          internalUsageAttributionIds?: string[];
        };

        const { places } = await placesLib.Place.searchNearby(request);
        if (cancelled) return;

        const mapped: DiscoveredMosque[] = [];
        for (const place of places) {
          if (!place.location) continue;
          const loc = {
            lat: place.location.lat(),
            lng: place.location.lng(),
          };
          const dist = geometryLib?.spherical
            ? geometryLib.spherical.computeDistanceBetween(center, loc)
            : haversineMeters(center, loc);

          mapped.push({
            id: place.id,
            displayName: place.displayName || 'Masjid',
            formattedAddress: place.formattedAddress || 'Alamat tersedia di Google Maps',
            location: loc,
            rating: place.rating ?? undefined,
            userRatingCount: place.userRatingCount ?? undefined,
            businessStatus: place.businessStatus ?? undefined,
            googleMapsURI: place.googleMapsURI ?? undefined,
            distanceMeters: dist,
          });
        }

        mapped.sort((a, b) => a.distanceMeters - b.distanceMeters);
        onMosquesLoaded(mapped);

        if (mapped.length > 0 && coreLib?.LatLngBounds && !routeTarget) {
          const bounds = new coreLib.LatLngBounds();
          bounds.extend(center);
          mapped.slice(0, 6).forEach((m) => bounds.extend(m.location));
          map.fitBounds(bounds, 56);
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Nearby mosque search failed:', err);
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        onError('Gagal memuat data masjid di sekitar koordinat ini. Silakan coba lagi.');
        onMosquesLoaded([]);
      } finally {
        if (!cancelled) onLoadingChange(false);
      }
    };

    void runSearch();
    return () => {
      cancelled = true;
    };
  }, [
    placesLib,
    map,
    geometryLib,
    coreLib,
    center.lat,
    center.lng,
    radiusMeters,
    searchTrigger,
  ]);

  // Compute & Render Route via modern Routes API (Route.computeRoutes)
  useEffect(() => {
    // Cleanup previous polylines
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    if (!routeTarget || !routesLib || !map) {
      onRouteComputed(null);
      return;
    }

    let cancelled = false;
    const calculateRoute = async () => {
      onRouteLoadingChange(true);
      try {
        const request = {
          origin: center,
          destination: routeTarget.location,
          travelMode,
          fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
        };

        // Use Route.computeRoutes from the loaded routes library
        const RouteClass = routesLib.Route as unknown as {
          computeRoutes: (req: unknown) => Promise<{
            routes?: Array<{
              distanceMeters?: number;
              durationMillis?: number;
              viewport?: google.maps.LatLngBounds;
              createPolylines: () => google.maps.Polyline[];
            }>;
          }>;
        };

        const { routes } = await RouteClass.computeRoutes(request);
        if (cancelled) return;

        if (!routes || routes.length === 0) {
          onRouteComputed(null);
          onError('Rute tidak ditemukan untuk mode perjalanan yang dipilih.');
          return;
        }

        const primaryRoute = routes[0];
        const newPolylines = primaryRoute.createPolylines();
        newPolylines.forEach((polyline) => {
          polyline.setOptions({
            strokeColor: '#10b981',
            strokeWeight: 6,
            strokeOpacity: 0.92,
          });
          polyline.setMap(map);
        });
        polylinesRef.current = newPolylines;

        if (primaryRoute.viewport) {
          map.fitBounds(primaryRoute.viewport, 60);
        }

        onRouteComputed({
          mosqueId: routeTarget.id,
          mosqueName: routeTarget.displayName,
          distanceMeters: primaryRoute.distanceMeters ?? routeTarget.distanceMeters,
          durationMillis: primaryRoute.durationMillis ?? 0,
          travelMode,
        });
      } catch (err) {
        if (cancelled) return;
        console.error('Route computation failed:', err);
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        onError('Tidak dapat menghitung rute perjalanan saat ini.');
        onRouteComputed(null);
      } finally {
        if (!cancelled) onRouteLoadingChange(false);
      }
    };

    void calculateRoute();

    return () => {
      cancelled = true;
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [routesLib, map, routeTarget, travelMode, center.lat, center.lng]);

  return null;
};

// ============================================================================
// Inner Map Workspace (runs inside <APIProvider>)
// ============================================================================
const MosqueMapWorkspace: React.FC = () => {
  const apiStatus = useApiLoadingStatus();

  const [userCoords, setUserCoords] = useState<LatLngLiteral>({
    lat: DEFAULT_CITIES[0].latitude,
    lng: DEFAULT_CITIES[0].longitude,
  });
  const [locationLabel, setLocationLabel] = useState<string>(DEFAULT_CITIES[0].city);
  const [locationSource, setLocationSource] = useState<'gps' | 'city' | 'search'>('city');
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);

  const [radiusMeters, setRadiusMeters] = useState<number>(5000);
  const [searchTrigger, setSearchTrigger] = useState<number>(0);
  const [mosques, setMosques] = useState<DiscoveredMosque[]>([]);
  const [isLoadingMosques, setIsLoadingMosques] = useState<boolean>(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const [selectedMosque, setSelectedMosque] = useState<DiscoveredMosque | null>(null);
  const [routeTarget, setRouteTarget] = useState<DiscoveredMosque | null>(null);
  const [travelMode, setTravelMode] = useState<TravelModeOption>('DRIVING');
  const [activeRoute, setActiveRoute] = useState<ActiveRouteInfo | null>(null);
  const [isComputingRoute, setIsComputingRoute] = useState<boolean>(false);

  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [textFilter, setTextFilter] = useState<string>('');

  // Islamicity-affiliated mosque IDs saved by user in localStorage (safe place_id storage)
  const [affiliatedIds, setAffiliatedIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(AFFILIATED_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage errors
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(AFFILIATED_STORAGE_KEY, JSON.stringify(affiliatedIds));
    } catch {
      // ignore storage errors
    }
  }, [affiliatedIds]);

  const toggleAffiliated = useCallback((mosqueId: string) => {
    setAffiliatedIds((prev) =>
      prev.includes(mosqueId) ? prev.filter((id) => id !== mosqueId) : [...prev, mosqueId]
    );
  }, []);

  const handleRequestGps = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setGeoNotice('Perangkat atau browser ini tidak mendukung layanan GPS Geolocation.');
      return;
    }
    setGeoLoading(true);
    setGeoNotice(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: Number(pos.coords.latitude.toFixed(6)),
          lng: Number(pos.coords.longitude.toFixed(6)),
        };
        setUserCoords(coords);
        setLocationLabel(`Koordinat GPS (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);
        setLocationSource('gps');
        setSelectedMosque(null);
        setRouteTarget(null);
        setActiveRoute(null);
        setGeoLoading(false);
        setSearchTrigger((n) => n + 1);
      },
      (err) => {
        setGeoLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoNotice('Izin lokasi ditolak. Anda dapat memilih kota atau mencari wilayah secara manual.');
        } else {
          setGeoNotice('Gagal mendeteksi koordinat GPS saat ini. Silakan pilih kota atau cari wilayah.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  // Attempt automatic geolocation on initial mount
  useEffect(() => {
    if ('geolocation' in navigator) {
      handleRequestGps();
    }
  }, [handleRequestGps]);

  const filteredMosques = useMemo(() => {
    return mosques.filter((m) => {
      if (filterMode === 'affiliated' && !affiliatedIds.includes(m.id)) return false;
      if (filterMode === 'top_rated' && (m.rating ?? 0) < 4.5) return false;
      if (textFilter.trim()) {
        const q = textFilter.trim().toLowerCase();
        return (
          m.displayName.toLowerCase().includes(q) ||
          m.formattedAddress.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [mosques, filterMode, affiliatedIds, textFilter]);

  const isMapError =
    apiStatus === APILoadingStatus.FAILED || apiStatus === APILoadingStatus.AUTH_FAILURE;

  return (
    <div className="space-y-6">
      {/* Section Header & Controls Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-emerald-400 shrink-0" />
            <span>Peta Masjid Terdekat & Jejaring Islamicity</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Temukan masjid terdekat berdasarkan koordinat lokasi Anda, hitung rute perjalanan langsung di peta, dan tandai masjid mitra jejaring Islamicity di sekitar wilayah Anda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <button
            type="button"
            onClick={handleRequestGps}
            disabled={geoLoading}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-slate-950 font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0"
          >
            {geoLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LocateFixed className="w-4 h-4" />
            )}
            <span>{geoLoading ? 'Mendeteksi GPS...' : 'Gunakan Lokasi Saya'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchTrigger((n) => n + 1)}
            disabled={isLoadingMosques}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isLoadingMosques ? 'animate-spin' : ''}`} />
            <span>Perbarui Pencarian</span>
          </button>
        </div>
      </div>

      {/* Location & Radius Control Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <AreaSearchInput
          onLocationSelected={(coords, label) => {
            setUserCoords(coords);
            setLocationLabel(label);
            setLocationSource('search');
            setSelectedMosque(null);
            setRouteTarget(null);
            setActiveRoute(null);
            setGeoNotice(null);
          }}
        />

        {/* Quick City Fallback Selector */}
        <select
          aria-label="Pilih kota acuan"
          value={locationSource === 'city' ? locationLabel : ''}
          onChange={(e) => {
            const city = DEFAULT_CITIES.find((c) => c.city === e.target.value);
            if (!city) return;
            setUserCoords({ lat: city.latitude, lng: city.longitude });
            setLocationLabel(city.city);
            setLocationSource('city');
            setSelectedMosque(null);
            setRouteTarget(null);
            setActiveRoute(null);
            setGeoNotice(null);
          }}
          className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
        >
          <option value="" disabled>
            Pilih Kota Acuan...
          </option>
          {DEFAULT_CITIES.map((c) => (
            <option key={c.city} value={c.city}>
              {c.city}
            </option>
          ))}
        </select>

        {/* Radius Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg shrink-0">
          {[2000, 5000, 10000, 25000].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRadiusMeters(r)}
              className={`px-2.5 py-1.5 rounded-md text-xs font-medium tabular-nums transition-colors whitespace-nowrap ${
                radiusMeters === r
                  ? 'bg-emerald-600 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r / 1000} km
            </button>
          ))}
        </div>
      </div>

      {/* Active Coordinate Readout + Notices */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Titik Pusat:</span>
          <strong className="text-slate-200">{locationLabel}</strong>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums text-emerald-400">
            {userCoords.lat.toFixed(5)}, {userCoords.lng.toFixed(5)}
          </span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">Radius {radiusMeters / 1000} km</span>
        </div>
        <div className="text-[11px] text-slate-500">
          {mosques.length} masjid ditemukan · {affiliatedIds.length} ditandai mitra Islamicity
        </div>
      </div>

      {geoNotice && (
        <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-700/40 text-amber-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{geoNotice}</span>
        </div>
      )}

      {mapError && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/50 text-red-200 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{mapError}</span>
        </div>
      )}

      {/* Main Split Workspace: Interactive Map (7 cols) + Mosque List (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Top: Interactive Google Map */}
        <div className="lg:col-span-7 space-y-3">
          <div className="relative w-full h-[460px] lg:h-[580px] rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
            {isMapError ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-2">
                <AlertTriangle className="w-8 h-8 text-amber-400" />
                <div className="text-sm font-semibold text-white">
                  Peta Google Maps tidak dapat dimuat
                </div>
                <p className="text-xs text-slate-400 max-w-md">
                  Periksa koneksi jaringan atau konfigurasi kunci API Google Maps Platform Anda.
                </p>
              </div>
            ) : (
              <GoogleMap
                defaultCenter={userCoords}
                defaultZoom={14}
                mapId="DEMO_MAP_ID"
                gestureHandling="greedy"
                internalUsageAttributionIds={[ATTRIBUTION_ID]}
                style={{ width: '100%', height: '100%' }}
                onClick={() => setSelectedMosque(null)}
              >
                <MapServicesController
                  center={userCoords}
                  radiusMeters={radiusMeters}
                  searchTrigger={searchTrigger}
                  routeTarget={routeTarget}
                  travelMode={travelMode}
                  onMosquesLoaded={setMosques}
                  onLoadingChange={setIsLoadingMosques}
                  onError={setMapError}
                  onRouteComputed={setActiveRoute}
                  onRouteLoadingChange={setIsComputingRoute}
                />

                {/* User Current Location Marker */}
                <AdvancedMarker
                  position={userCoords}
                  title="Lokasi Anda Saat Ini"
                  zIndex={60}
                >
                  <div className="relative flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-sky-500 border-2 border-white shadow-lg" />
                  </div>
                </AdvancedMarker>

                {/* Discovered Mosque Markers */}
                {filteredMosques.map((mosque) => (
                  <MosqueMarkerItem
                    key={mosque.id}
                    mosque={mosque}
                    isSelected={selectedMosque?.id === mosque.id}
                    isAffiliated={affiliatedIds.includes(mosque.id)}
                    onSelect={(m) => setSelectedMosque(m)}
                    onCloseInfo={() => setSelectedMosque(null)}
                    onRequestRoute={(m) => {
                      setSelectedMosque(m);
                      setRouteTarget(m);
                    }}
                    onToggleAffiliated={toggleAffiliated}
                  />
                ))}
              </GoogleMap>
            )}

            {/* Loading Overlay */}
            {isLoadingMosques && (
              <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-lg bg-slate-950/90 border border-slate-700 text-xs text-slate-200 flex items-center gap-2 shadow-md">
                <Loader2 className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>Mencari masjid terdekat...</span>
              </div>
            )}
          </div>

          {/* Active Route Summary & Travel Mode Bar */}
          {(routeTarget || activeRoute || isComputingRoute) && (
            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <RouteIcon className="w-4 h-4" />
                  <span>
                    {isComputingRoute
                      ? 'Menghitung rute menuju masjid...'
                      : `Rute ke ${activeRoute?.mosqueName || routeTarget?.displayName}`}
                  </span>
                </div>
                {activeRoute && !isComputingRoute && (
                  <div className="flex items-center gap-3 text-xs text-slate-300 tabular-nums">
                    <span>Jarak tempuh: <strong className="text-white">{formatDistance(activeRoute.distanceMeters)}</strong></span>
                    <span aria-hidden="true">·</span>
                    <span>Estimasi waktu: <strong className="text-amber-300">{formatDuration(activeRoute.durationMillis)}</strong></span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {(
                  [
                    { mode: 'DRIVING', label: 'Mobil', icon: Car },
                    { mode: 'TWO_WHEELER', label: 'Motor', icon: Bike },
                    { mode: 'WALKING', label: 'Jalan', icon: Footprints },
                  ] as const
                ).map(({ mode, label, icon: Icon }) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTravelMode(mode)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                      travelMode === mode
                        ? 'bg-emerald-600 text-slate-950 font-semibold'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setRouteTarget(null);
                    setActiveRoute(null);
                  }}
                  aria-label="Tutup rute"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
              <span>Lokasi Anda</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Mitra Islamicity Tersimpan</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-800 border border-emerald-400 inline-block" />
              <span>Masjid Terdekat</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>Masjid Dipilih</span>
            </span>
          </div>
        </div>

        {/* Right: Discovered Mosques List & Islamicity Affiliation Controls */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Daftar Masjid Sekitar</span>
            </h3>
            <span className="text-xs text-slate-400 tabular-nums">
              {filteredMosques.length} hasil
            </span>
          </div>

          {/* Filter Tabs + Text Filter */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
              {(
                [
                  { id: 'all', label: 'Semua' },
                  { id: 'affiliated', label: `Mitra Saya (${affiliatedIds.length})` },
                  { id: 'top_rated', label: 'Rating ≥ 4.5' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterMode(tab.id)}
                  className={`flex-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    filterMode === tab.id
                      ? 'bg-slate-800 text-emerald-300 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={textFilter}
                onChange={(e) => setTextFilter(e.target.value)}
                placeholder="Filter nama masjid atau nama jalan..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Mosque Cards Container */}
          <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
            {isLoadingMosques && mosques.length === 0 ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 animate-pulse space-y-2"
                >
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded w-full" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                </div>
              ))
            ) : filteredMosques.length === 0 ? (
              <div className="p-6 rounded-lg bg-slate-950 border border-slate-800 text-center space-y-2">
                <MapPin className="w-6 h-6 text-slate-500 mx-auto" />
                <div className="text-xs font-semibold text-slate-300">
                  {filterMode === 'affiliated'
                    ? 'Belum ada masjid mitra yang ditandai di area ini'
                    : 'Tidak ada masjid ditemukan pada filter atau radius ini'}
                </div>
                <p className="text-[11px] text-slate-500">
                  {filterMode === 'affiliated'
                    ? 'Klik "Tandai Mitra" pada salah satu masjid di daftar untuk menyimpannya ke jaringan mitra Islamicity Anda.'
                    : 'Coba perbesar radius pencarian atau geser pencarian ke wilayah lain.'}
                </p>
                {filterMode !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setFilterMode('all')}
                    className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs text-emerald-300 font-medium"
                  >
                    Tampilkan Semua Masjid
                  </button>
                )}
              </div>
            ) : (
              filteredMosques.map((mosque) => {
                const isSelected = selectedMosque?.id === mosque.id;
                const isAffiliated = affiliatedIds.includes(mosque.id);
                return (
                  <div
                    key={mosque.id}
                    className={`p-3.5 rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-slate-950 border-amber-500/60'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedMosque(mosque)}
                      className="w-full text-left space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-white leading-snug">
                          {mosque.displayName}
                        </h4>
                        <span className="text-xs font-mono font-semibold text-emerald-400 tabular-nums shrink-0">
                          {formatDistance(mosque.distanceMeters)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 tabular-nums">
                        {isAffiliated && (
                          <>
                            <span className="text-emerald-400 font-medium inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Mitra Islamicity
                            </span>
                            <span aria-hidden="true">·</span>
                          </>
                        )}
                        {mosque.rating !== undefined && (
                          <>
                            <span className="text-amber-300 inline-flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                              {mosque.rating.toFixed(1)} ({mosque.userRatingCount ?? 0})
                            </span>
                            <span aria-hidden="true">·</span>
                          </>
                        )}
                        <span>
                          {mosque.businessStatus === 'OPERATIONAL' ? 'Aktif' : 'Terdaftar'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {mosque.formattedAddress}
                      </p>
                    </button>

                    <div className="pt-2.5 mt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMosque(mosque);
                            setRouteTarget(mosque);
                          }}
                          className="px-2.5 py-1 rounded-md bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Rute</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleAffiliated(mosque.id)}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 border transition-colors ${
                            isAffiliated
                              ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                              : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                          }`}
                        >
                          <Bookmark className={`w-3 h-3 ${isAffiliated ? 'fill-emerald-400 text-emerald-400' : ''}`} />
                          <span>{isAffiliated ? 'Mitra Tersimpan' : 'Tandai Mitra'}</span>
                        </button>
                      </div>

                      {mosque.googleMapsURI && (
                        <a
                          href={mosque.googleMapsURI}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-slate-400 hover:text-emerald-300 inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Google Maps</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Root Export wrapped in <APIProvider>
// ============================================================================
export const MosqueMapSection: React.FC = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  if (!apiKey) {
    return (
      <div className="p-8 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-3 max-w-2xl mx-auto">
        <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Kunci API Google Maps Belum Terkonfigurasi</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Tambahkan variabel lingkungan <code className="text-emerald-300">VITE_GOOGLE_MAPS_API_KEY</code> untuk mengaktifkan peta interaktif pencarian masjid terdekat.
        </p>
      </div>
    );
  }

  return (
    <APIProvider
      apiKey={apiKey}
      language="id"
      region="ID"
      libraries={['places', 'marker', 'routes', 'geometry', 'core']}
    >
      <MosqueMapWorkspace />
    </APIProvider>
  );
};
