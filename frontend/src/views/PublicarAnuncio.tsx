import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import departamentosData from "../data/ubigeo_peru_2016_departamentos.json";
import provinciasData from "../data/ubigeo_peru_2016_provincias.json";
import distritosData from "../data/ubigeo_peru_2016_distritos.json"

const PublicarAnuncio = () => {
    const [nombre, setNombre] = useState<string>("");
    const [edad, setEdad] = useState<string>("");
    const [numero, setNumero] = useState<string>("")
    const [descripcion, setDescripcion] = useState<string>("")
    const [texto, setTexto] = useState<string>("");
    const [imagenes, setImagenes] = useState<File[]>([]);
    const [previas, setPrevias] = useState<string[]>([]);
    const [subiendo, setSubiendo] = useState<boolean>(false);

    const [departamentoId, setDepartamentoId] = useState("");
    const [departamentoNombre, setDepartamentoNombre] = useState("");

    const [provinciaId, setProvinciaId] = useState("")
    const [provinciaNombre, setProvinciaNombre] = useState("")

    const [distritoId, setDistritoId] = useState("");
    const [distritoNombre, setDistritoNombre] = useState("");

    const [provincias, setProvincias] = useState<any[]>([]);
    const [distritos, setDistritos] = useState<any[]>([]);

    const [horarios, setHorarios] = useState<{ dia: string; inicio: string; fin: string }[]>([])
    const [diasSeleccionados, setDiasSeleccionados] = useState<string[]>([])
    const [mismoHorario, setMismoHorario] = useState<boolean>(true);
    const [horarioUnico, setHorarioUnico] = useState<{ inicio: string; fin: string }>({ inicio: "", fin: "" });

    const manejadorEdad = (e: React.ChangeEvent<HTMLInputElement>) => {
        let input = e.target.value;
        if (input.length > 2) {
            input = input.slice(0, 2);
        }
        setEdad(input);
    }

    const manejadorNumero = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Elimina cualquier carácter que no sea dígito
        const value = e.target.value.replace(/\D/g, '');
        setNumero(value);
    };


    const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

    const agregarHorario = () => {
        setHorarios([...horarios, { dia: "", inicio: "", fin: "" }])
    }

    const actualizarHorario = (index: number, key: string, value: string) => {
        const nuevosHorarios = [...horarios];
        nuevosHorarios[index] = { ...nuevosHorarios[index], [key]: value };
        setHorarios(nuevosHorarios);
    }

    const eliminarHorario = (index: number) => {
        setHorarios(horarios.filter((_, i) => i !== index));
    }

    const toggleDiaSeleccionado = (dia: string) => {
        if (diasSeleccionados.includes(dia)) {
            setDiasSeleccionados(diasSeleccionados.filter(d => d !== dia));
        } else {
            setDiasSeleccionados([...diasSeleccionados, dia]);
        }
    };


    useEffect(() => {
        const nuevasPrevias = imagenes.map((imagen) => URL.createObjectURL(imagen));
        setPrevias(nuevasPrevias);

        return () => {
            nuevasPrevias.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imagenes]);

    useEffect(() => {
        if (departamentoId) {
            const provinciasFiltradas = provinciasData.filter(
                (p) => p.department_id === departamentoId
            );
            setProvincias(provinciasFiltradas);
            setProvinciaId(""); // Reinicia la provincia al cambiar el departamento
            setProvinciaNombre("")
            setDistritoId("");  // Reinicia el distrito
            setDistritoNombre("")
        } else {
            setProvincias([]);
            setDistritos([]);
        }
    }, [departamentoId]);

    useEffect(() => {
        if (provinciaId) {
            const distritosFiltrados = distritosData.filter(
                (d) => d.province_id === provinciaId
            );
            setDistritos(distritosFiltrados);
            setDistritoId(""); // Reinicia el distrito al cambiar la provincia
            setDistritoNombre("")
        } else {
            setDistritos([]);
        }
    }, [provinciaId]);

    const convertirImagenABase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };
    const manejarCambioImagenes = (e: React.ChangeEvent<HTMLInputElement>) => {
        const archivosSeleccionados = Array.from(e.target.files || [])

        // Filtrar archivos duplicados
        const archivosUnicos = archivosSeleccionados.filter(
            (archivo) => !imagenes.some((img) => img.name === archivo.name)
        )

        // Verificar que no supere el límite de 3 imágenes
        if (imagenes.length + archivosUnicos.length > 3) {
            toast.error("Solo puedes subir hasta 3 imágenes.")
            return
        }

        // Agregar nuevas imágenes sin reemplazar las anteriores
        setImagenes((prevImagenes) => [...prevImagenes, ...archivosUnicos])
    }

    const eliminarImagen = (index: number) => {
        setImagenes((prevImagenes) => {
            const nuevasImagenes = prevImagenes.filter((_, i) => i !== index);
            if (nuevasImagenes.length === 0) setPrevias([]); // Limpiar previas solo si no hay imágenes
            return nuevasImagenes;
        });

        setPrevias((prevPrevias) => {
            const nuevasPrevias = prevPrevias.filter((_, i) => i !== index);
            URL.revokeObjectURL(prevPrevias[index]);
            return nuevasPrevias;
        });
    };

    const manejarFormulario = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const user = auth.currentUser;
        if (!user) {
            toast.error("No estás autenticado. Por favor inicia sesión.");
            return;
        }

        if (!departamentoId || !provinciaId || !distritoId) {
            toast.error("Debes seleccionar tu departamento, provincia y distrito.");
            return;
        }

        if (!nombre || !edad || !numero || imagenes.length < 3 || descripcion.length < 40) {
            toast.error("Debes completar todos los campos, subir al menos 3 imágenes y la descripción debe tener al menos 40 caracteres.");
            return;
        }

        const edadNumero = Number(edad);
        if (edadNumero < 18) {
            toast.error("Debes ser mayor de 18 años para publicar un anuncio.");
            return;
        }
        if (edadNumero > 65) {
            toast.error("Debes ser menor de 65 años para publicar un anuncio.");
            return;
        }

        const numeroPattern = /^9\d{8}$/;
        if (!numeroPattern.test(numero)) {
            toast.error("El número debe ser de 9 dígitos");
            return;
        }

        if (horarios.length === 0 || horarios.some(h => !h.dia || !h.inicio || !h.fin)) {
            toast.error("Por favor, completa o elimina los horarios vacíos.");
            return;
        }

        setSubiendo(true);

        try {
            // Convertir imágenes a Base64
            const imagenesBase64 = await Promise.all(
                imagenes.map(async (imagen) => await convertirImagenABase64(imagen))
            );

            // Guardar en Firestore
            await setDoc(
                doc(db, "usuarios", user.uid),
                {
                    nombre,
                    edad: edadNumero,
                    numero: Number(numero),
                    descripcion,
                    email: user.email,
                    imagenes: imagenesBase64,
                    actualizado: new Date(),
                    departamento: departamentoNombre,
                    provincia: provinciaNombre,
                    distrito: distritoNombre,
                    horarios,
                },
                { merge: true }
            );
            toast.success("Información guardada correctamente");
            setNombre("");
            setEdad("");
            setNumero("");
            setDescripcion("");
            setImagenes([]);
            setPrevias([]);
            setDepartamentoId("");
            setDepartamentoNombre("");
            setProvinciaId("");
            setProvinciaNombre("");
            setDistritoId("");
            setDistritoNombre("");
            setHorarios([])
            setTexto("")
        } catch (error) {
            console.error("Error al subir imágenes o guardar datos: ", error);
            toast.error("Hubo un error al guardar la información.");
        } finally {
            setSubiendo(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F4F4] text-[#101828] p-2">
            <div className="bg-[#101828] text-white p-2 border-[#101828] mb-2">
                <h2 className="text-2xl font-bold text-center">
                    PUBLICAR ANUNCIO
                </h2>
                <h3 className="text-center text-sm font-medium">
                    Completa la información requerida para poder publicar tu anuncio.
                </h3>
            </div>
            <form onSubmit={manejarFormulario} className="space-y-4">
                <div className="border-[1px] border-[#101828] bg-white p-2">
                    <h2 className="text-center font-bold mb-2 text-lg">CONTACTO</h2>
                    <label htmlFor="numero" className="font-bold">
                        Número de celular:
                    </label>
                    <input
                        type="tel"
                        id="numero"
                        value={numero}
                        onChange={manejadorNumero}
                        className="mt-1 block w-full p-2 rounded text-black border-2"
                        required
                        inputMode="numeric"
                        maxLength={9}
                        onInvalid={(e) => {
                            e.currentTarget.setCustomValidity("El número debe ser de 9 dígitos")
                        }}
                    />
                </div>
                <div className="border-[1px] border-[#101828] bg-white p-2 space-y-5">
                    <h2 className="text-center font-bold mb-2 text-lg">PRESENTACIÓN</h2>
                    <div>
                        <label htmlFor="nombre" className="font-bold">
                            Nombre:
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="mt-1 block w-full p-2 rounded border-2"
                            required
                            onInvalid={(e) =>
                                e.currentTarget.setCustomValidity("Ingresa tu nombre")
                            }
                            onInput={(e) => e.currentTarget.setCustomValidity("")}
                        />
                    </div>
                    <div>
                        <label htmlFor="edad" className="font-bold">
                            Edad:
                        </label>
                        <input
                            type="number"
                            id="edad"
                            value={edad}
                            onChange={manejadorEdad}
                            className="mt-1 block w-full p-2 rounded border-2"
                            min="18"
                            max="99"
                            required
                            onInvalid={(e) => {
                                const input = e.currentTarget;
                                if (!input.value) {
                                    input.setCustomValidity("Ingresa tu edad");
                                } else {
                                    input.setCustomValidity("La edad debe estar entre 18 y 65 años");
                                }
                            }}
                            onInput={(e) => e.currentTarget.setCustomValidity("")}
                        />
                    </div>
                    <div>
                        <label htmlFor="descripcion" className="font-bold">
                            Título:
                        </label>
                        <textarea
                            id="descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="mt-1 border-2 w-full p-2 rounded text-black resize-none"
                            rows={2}
                            required
                            minLength={40}
                            maxLength={60}
                            placeholder="Ejemplo: Una rica señorita con senos, nalgas grandes y redondas."
                            onInvalid={(e) => {
                                const input = e.currentTarget;
                                if (input.value.length < 40) {
                                    input.setCustomValidity("La descripción debe tener al menos 40 caracteres");
                                }
                            }}
                            onInput={(e) => e.currentTarget.setCustomValidity("")}
                        />
                        <p className={`text-xs text-end ${descripcion.length >= 40 ? "text-[#00AA00]" : "text-[#FF0000]"}`}>
                            Llevas {descripcion.length} caracteres. {descripcion.length < 40 && "El mínimo son 40."}
                            {descripcion.length > 40 && "El máximo son 60."}
                        </p>
                    </div>
                    <div>
                        <label htmlFor="texto" className="font-bold">
                            Texto:
                        </label>
                        <textarea
                            id="texto"
                            value={texto}
                            onChange={(e) => setTexto(e.target.value)}
                            className="mt-1 border-2 w-full p-2 rounded text-black resize-none"
                            rows={5}
                            required
                            minLength={250}
                            onInvalid={(e) => {
                                const input = e.currentTarget;
                                if (input.value.length < 250) {
                                    input.setCustomValidity("El texto debe tener al menos 250 caracteres");
                                }
                            }}
                            onInput={(e) => e.currentTarget.setCustomValidity("")}
                        />
                        <p className={`text-xs text-end ${texto.length >= 250 ? "text-[#00AA00]" : "text-[#FF0000]"}`}>
                            Llevas {texto.length} caracteres. {texto.length < 250 && "El mínimo son 250."}
                        </p>
                    </div>
                </div>
                <div>
                    <label htmlFor="departamento" className="block">
                        Departamento:
                    </label>
                    <select
                        id="departamento"
                        value={departamentoId}
                        onChange={(e) => {
                            const selectedDepartment = departamentosData.find(dep => dep.id === e.target.value);
                            if (selectedDepartment) {
                                setDepartamentoId(selectedDepartment.id);
                                setDepartamentoNombre(selectedDepartment.name);
                            } else {
                                setDepartamentoId("");
                                setDepartamentoNombre("");
                            }
                        }}
                        className="mt-1 block w-full p-2 rounded text-black"
                        required
                    >
                        <option value="">Selecciona un departamento</option>
                        {departamentosData.map(dep => (
                            <option key={dep.id} value={dep.id}>
                                {dep.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="provincia" className="block">
                        Provincia:
                    </label>
                    <select
                        id="provincia"
                        value={provinciaId}
                        onChange={(e) => {
                            const selectedProvince = provincias.find((p) => p.id === e.target.value);
                            if (selectedProvince) {
                                setProvinciaId(selectedProvince.id);
                                setProvinciaNombre(selectedProvince.name);
                            } else {
                                setProvinciaId("");
                                setProvinciaNombre("");
                            }
                        }}
                        className="mt-1 block w-full p-2 rounded text-black"
                        required
                        disabled={!departamentoId}
                    >
                        <option value="">Selecciona una provincia</option>
                        {provincias.map(prov => (
                            <option key={prov.id} value={prov.id}>
                                {prov.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="distrito" className="block">
                        Distrito:
                    </label>
                    <select
                        id="distrito"
                        value={distritoId}
                        onChange={(e) => {
                            const selectedDistrict = distritos.find((d) => d.id === e.target.value);
                            if (selectedDistrict) {
                                setDistritoId(selectedDistrict.id);
                                setDistritoNombre(selectedDistrict.name);
                            } else {
                                setDistritoId("");
                                setDistritoNombre("");
                            }
                        }}
                        className="mt-1 block w-full p-2 rounded text-black"
                        disabled={!provinciaId}
                        required
                    >
                        <option value="">Selecciona un distrito</option>
                        {distritos.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="border-[1px] border-[#101828] p-2">
                    <h2 className="text-center font-bold mb-2 text-lg">HORARIOS DE ATENCIÓN</h2>
                    <div className="mb-2">
                        <p className="mb-2">¿Mismo horario para los días en que trabajas?</p>
                        <label className="mr-2">
                            <input
                                type="radio"
                                name="mismoHorario"
                                checked={mismoHorario}
                                onChange={() => setMismoHorario(true)}
                                className="mr-1"
                            />
                            Sí
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="mismoHorario"
                                checked={!mismoHorario}
                                onChange={() => setMismoHorario(false)}
                                className="mr-1"
                            />
                            No
                        </label>
                    </div>
                </div>

                {mismoHorario ? (
                    // Modo "mismo horario": se muestra la selección de días y los inputs de hora únicos
                    <>
                        <div className="mb-2">
                            <p className="text-white mb-1">Selecciona los días en que trabajas:</p>
                            <div className="flex flex-wrap gap-2">
                                {diasSemana.map((dia) => (
                                    <button
                                        key={dia}
                                        type="button"
                                        onClick={() => toggleDiaSeleccionado(dia)}
                                        className={`px-3 py-1 rounded ${diasSeleccionados.includes(dia)
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-300 text-black"
                                            }`}
                                    >
                                        {dia}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:space-x-2 items-start sm:items-center mb-2">
                            <input
                                type="time"
                                value={horarioUnico.inicio}
                                onChange={(e) =>
                                    setHorarioUnico({ ...horarioUnico, inicio: e.target.value })
                                }
                                className="p-1 border rounded text-black w-full sm:w-auto"
                            />
                            <input
                                type="time"
                                value={horarioUnico.fin}
                                onChange={(e) =>
                                    setHorarioUnico({ ...horarioUnico, fin: e.target.value })
                                }
                                className="p-1 border rounded text-black w-full sm:w-auto"
                            />
                        </div>
                    </>
                ) : (
                    // Modo de horarios individuales (lo de tu código actual)
                    <>
                        {horarios.map((horario, index) => (
                            <div key={index} className="flex flex-col sm:flex-row sm:space-x-2 items-start sm:items-center mb-2">
                                <select
                                    value={horario.dia}
                                    onChange={(e) => actualizarHorario(index, "dia", e.target.value)}
                                    className="p-1 border rounded text-black w-full sm:w-auto"
                                >
                                    <option value="">Día</option>
                                    {diasSemana.map((dia) => (
                                        <option key={dia} value={dia}>
                                            {dia}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="time"
                                    value={horario.inicio}
                                    onChange={(e) => actualizarHorario(index, "inicio", e.target.value)}
                                    className="p-1 border rounded text-black w-full sm:w-auto"
                                />
                                <input
                                    type="time"
                                    value={horario.fin}
                                    onChange={(e) => actualizarHorario(index, "fin", e.target.value)}
                                    className="p-1 border rounded text-black w-full sm:w-auto"
                                />
                                <button
                                    onClick={() => eliminarHorario(index)}
                                    className="p-1 bg-red-500 text-white rounded"
                                >
                                    ✖
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={agregarHorario}
                            className="p-2 bg-blue-500 text-white rounded"
                        >
                            Agregar horario +
                        </button>
                    </>
                )}


                <div>
                    <label htmlFor="imagenes" className="block text-white">
                        Subir Imágenes (mínimo 3):
                    </label>
                    <input
                        type="file"
                        id="imagenes"
                        accept="image/*"
                        multiple
                        onChange={manejarCambioImagenes}
                        className="mt-1 block w-full p-2 rounded bg-white text-black"
                    />
                </div>

                {/* Vista previa de imágenes */}
                {previas.length > 0 && (
                    <div className="mt-4 flex gap-2 flex-wrap">
                        {previas.map((src, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={src}
                                    alt={`Vista previa ${index + 1}`}
                                    className="w-24 h-24 object-cover rounded-md border border-gray-300"
                                />
                                {/* Botón para eliminar la imagen */}
                                <button
                                    onClick={() => eliminarImagen(index)}
                                    type="button"
                                    className="absolute top-0 right-0 flex items-center justify-center  bg-red-500 text-white text-xs rounded-full w-6 h-6"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={subiendo}
                    className="w-full flex justify-center rounded-md px-3 py-2 font-semibold text-white bg-[#EA580C] hover:bg-[#FF6B35]"
                >
                    {subiendo ? "Subiendo..." : "Publicar Anuncio"}
                </button>
            </form>

            <div className="w-full max-w-md rounded shadow bg-white">


            </div>
        </div>
    );
};

export default PublicarAnuncio;

