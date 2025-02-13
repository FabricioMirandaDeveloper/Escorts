import { faFire } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate()
    return (
        <header className="bg-[#101828] px-4 py-3 flex justify-between items-center">
            <div className="flex justify-start items-center font-bold text-2xl">
                <Link to="/" className="flex items-center">
                <h1 className="text-white mr-2">PROYECTO</h1>
                <FontAwesomeIcon icon={faFire} className="text-orange-600" />
                </Link>
            </div>
            <div>
                <button className="bg-[#EA580C] p-2 rounded-lg text-sm font-bold" onClick={() => navigate("/login")}>Publicar anuncio</button>
            </div>
        </header>
    )
}