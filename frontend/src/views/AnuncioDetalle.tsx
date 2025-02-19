import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Slider from "react-slick";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";

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

    // Flechas personalizadas
    const PrevArrow = ({ onClick }: any) => (
        <div
            className="absolute z-10 w-10 h-10 left-0 top-1/2 transform -translate-y-1/2 p-2 text-white bg-red-600 rounded-full flex items-center justify-center"
            onClick={onClick}
        >
            <FontAwesomeIcon icon={faArrowLeft} />
        </div>
    );

    const NextArrow = ({ onClick }: any) => (
        <div
            className="absolute z-10 w-10 h-10 right-0 top-1/2 transform -translate-y-1/2 text-white bg-red-600 rounded-full flex  items-center justify-center"
            onClick={onClick}
        >
            <FontAwesomeIcon icon={faArrowRight} />
        </div>
    );

    // Configuración del Slider
    const sliderSettings = {
        dots: true,          // Mostrar puntos de navegación
        infinite: true,      // Desplazamiento infinito
        speed: 500,          // Velocidad de transición
        slidesToShow: 1,     // Mostrar solo una imagen por vez
        slidesToScroll: 1,   // Desplazar una imagen a la vez
        autoplay: true,      // Autoplay para cambiar automáticamente de imagen
        autoplaySpeed: 3000, // Intervalo de tiempo entre las transiciones
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
    };

    return (
        <div className="p-4">
            {/* Botón de cerrar / regresar a anuncios */}
            <Link to="/" className="absolute z-10 top-5 right-5 w-10 h-10 flex justify-center items-center bg-red-600 rounded-full">
                <span className="text-xl font-bold">X</span>
            </Link>

            {/* Mostrar imagen ampliada (o un slider si hay varias imágenes) */}
            {anuncio.imagenes && anuncio.imagenes.length > 0 && (
                <Slider {...sliderSettings}>
                    {anuncio.imagenes.map((imagen, index) => (
                        <div key={index} className="w-max-[288px] h-[384px] mb-4">
                            <img
                                src={imagen}
                                alt={`${anuncio.nombre} - imagen ${index + 1}`}
                                className="w-full h-full object-cover   rounded"
                            />
                        </div>
                    ))}
                </Slider>
            )}

            <h1 className="text-2xl font-bold mb-2">
                {anuncio.nombre} | {anuncio.edad} años
            </h1>
            <p className="mb-4">{anuncio.descripcion}</p>

            {/* Sección de contacto vía WhatsApp */}
            <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center space-x-2 py-3 font-bold bg-[#52CD5F]">
                <FontAwesomeIcon icon={faWhatsapp} style={{ color: "white", fontSize: "30px" }} />
                <a
                    href={`https://wa.me/${anuncio.numero}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white"
                >
                    Contactar por WhatsApp
                </a>
            </div>
        </div>
    );
};

export default AnuncioDetalle;
