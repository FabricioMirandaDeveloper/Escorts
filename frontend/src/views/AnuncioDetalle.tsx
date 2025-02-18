import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

// Interfaz para tipar el anuncio (ajústala según tus necesidades)
interface Anuncio {
    id: string;
    nombre: string;
    edad: number;
    numero: number;
    descripcion: string;
    email: string;
    imagenes: string[];
    actualizado: any;
}

const AnuncioDetalle = () => {
    const { id } = useParams<{ id: string }>();
    const [anuncio, setAnuncio] = useState<Anuncio | null>(null);
    const [cargando, setCargando] = useState<boolean>(true);

    useEffect(() => {
        const obtenerAnuncio = async () => {
            try {
                const docRef = doc(db, "usuarios", id!);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setAnuncio({ id: docSnap.id, ...docSnap.data() } as Anuncio);
                } else {
                    console.log("No se encontró el anuncio");
                }
            } catch (error) {
                console.error("Error al obtener el anuncio:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerAnuncio();
    }, [id]);

    if (cargando) {
        return <p>Cargando anuncio...</p>;
    }

    if (!anuncio) {
        return <p>No se encontró el anuncio.</p>;
    }

    return (
        <div className="p-4">
            {/* Mostrar imagen ampliada (o un slider si hay varias imágenes) */}
            {anuncio.imagenes && anuncio.imagenes.length > 0 && (
                <img
                    src={anuncio.imagenes[0]}
                    alt={`${anuncio.nombre} - imagen`}
                    className="w-[288px] min-h-[384px] object-cover rounded-lg mb-4"
                />
            )}

            <h1 className="text-2xl font-bold mb-2">
                {anuncio.nombre} | {anuncio.edad} años
            </h1>
            <p className="mb-4">{anuncio.descripcion}</p>

            {/* Sección de contacto vía WhatsApp */}
            <div className="flex justify-center items-center space-x-2 bg-white py-3 rounded font-bold">
                <FontAwesomeIcon icon={faWhatsapp} style={{ color: "#63E6BE", fontSize: "30px"}} />

                <a
                    href={`https://wa.me/${anuncio.numero}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#101828]"
                >
                    Contactar por WhatsApp
                </a>
            </div>
        </div>
    );
};

export default AnuncioDetalle;
