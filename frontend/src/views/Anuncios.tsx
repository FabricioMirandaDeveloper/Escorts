import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, Timestamp } from "firebase/firestore";
import { Link } from "react-router-dom";

// Interfaz para tipar el anuncio (ajústala según tus necesidades)
interface Anuncio {
    id: string;
    nombre: string;
    edad: number;
    numero: number;
    descripcion: string;
    email: string;
    imagenes: string[];
    actualizado: Timestamp;
}

const Anuncios = () => {
    const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);

    useEffect(() => {
        const obtenerAnuncios = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "usuarios"));
                const anunciosData: Anuncio[] = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        nombre: data.nombre,
                        edad: data.edad,
                        numero: data.numero,
                        email: data.email,
                        imagenes: data.imagenes,
                        actualizado: data.actualizado,
                    };
                });
                setAnuncios(anunciosData);
            } catch (error) {
                console.error("Error al obtener anuncios:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerAnuncios();
    }, []);

    if (cargando) {
        return <p>Cargando anuncios...</p>;
    }

    return (
        <div className="grid grid-cols-2 gap-2 p-2">
            {anuncios.map((anuncio) => (
                <Link
                to={`/anuncio/${anuncio.id}`}
                key={anuncio.id}
                className="rounded-md overflow-hidden"
            >
                {/* Contenedor de la imagen con posición relativa para superponer el overlay */}
                {anuncio.imagenes && anuncio.imagenes.length > 0 && (
                    <div className="relative w-full h-64">
                        <img
                            src={anuncio.imagenes[0]}
                            alt={`${anuncio.nombre} - imagen`}
                            className="w-full h-full object-cover"
                        />
                        {/* Overlay con nombre y edad en la parte inferior */}
                        <div className="absolute bottom-1 left-1 flex justify-center items-center bg-black bg-opacity-50 text-white py-1 px-2 rounded-md">
                            <span className="text-xs font-bold">{anuncio.edad} años</span>
                        </div>
                    </div>
                )}
            </Link>
            ))}
        </div>
    );
};

export default Anuncios;
