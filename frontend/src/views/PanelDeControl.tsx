import { Link } from "react-router-dom";

export default function PanelDeControl() {

    return (
        <div className="p-4 text-center">
            <h1 className="text-3xl font-bold text-white">Panel de Control</h1>
            {/* Otros elementos del panel */}
            <Link
                to="/publicar-anuncio"
                className="mt-6 inline-block bg-[#EA580C] text-white px-4 py-2 rounded hover:bg-[#FF6B35] font-bold"
            >
                Publicar Anuncio
            </Link>
        </div>
    )
}