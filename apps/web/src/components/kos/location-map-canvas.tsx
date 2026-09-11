import L from "leaflet";
import { useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

import type { Gender, KosDetail } from "@/domain/kos/types";

import "leaflet/dist/leaflet.css";

const pinClass: Record<Gender, string> = {
	campur: "bg-gender-campur",
	putra: "bg-gender-putra",
	putri: "bg-gender-putri",
};

function SyncView({
	lat,
	lng,
	zoom,
}: {
	lat: number;
	lng: number;
	zoom: number;
}) {
	const map = useMap();

	useEffect(() => {
		map.setView([lat, lng], zoom);
	}, [map, lat, lng, zoom]);

	return null;
}

export default function LocationMapCanvas({
	lat,
	lng,
	zoom,
	gender,
}: {
	lat: number;
	lng: number;
	zoom: number;
	gender: KosDetail["gender"];
}) {
	const icon = useMemo(
		() =>
			L.divIcon({
				className: "kos-detail-pin-wrap",
				html: `<span class="kos-detail-pin ${pinClass[gender]}"></span>`,
				iconSize: [14, 14],
				iconAnchor: [7, 7],
			}),
		[gender],
	);

	return (
		<MapContainer
			attributionControl={false}
			boxZoom={false}
			className="kos-detail-map absolute inset-0 z-0 size-full bg-muted"
			center={[lat, lng]}
			doubleClickZoom
			dragging
			keyboard={false}
			scrollWheelZoom={false}
			touchZoom
			zoom={zoom}
			zoomControl={false}
		>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			<Marker
				icon={icon}
				interactive={false}
				keyboard={false}
				position={[lat, lng]}
			/>
			<SyncView lat={lat} lng={lng} zoom={zoom} />
		</MapContainer>
	);
}
