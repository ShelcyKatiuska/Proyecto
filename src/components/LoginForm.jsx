import { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase"; 





export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // Cambia esta línea para redirigir a UserManagement
    } catch (error) {
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard"); // Cambia esta línea también
    } catch (error) {
      alert("Error al iniciar sesión con Google: " + error.message);
    }
  };

  // Redirigir a formulario de registro
  const handleRegister = () => {
    navigate("/register");
  };


  return (
    <section className="vh-100">
      <style>{`
        .divider {
          display: flex;
          align-items: center;
          margin: 1.5rem 0;
        }
        .divider:before,
        .divider:after {
          content: "";
          flex: 1;
          height: 1px;
          background: #eee;
        }
      `}</style>

      <div className="container py-5 h-100">
        <div className="row d-flex align-items-center justify-content-center h-100">
          {/* Imagen izquierda */}
          <div className="col-md-8 col-lg-7 col-xl-6">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="img-fluid"
              alt="Imagen teléfono"
            />
          </div>

          {/* Formulario */}
          <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
            <form onSubmit={handleLogin}>
              {/* Correo */}
              <div className="form-outline mb-4">
                <input
                  type="email"
                  id="form1Example13"
                  className="form-control form-control-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="correo@ejemplo.com"
                />
                <label className="form-label" htmlFor="form1Example13">
                  Correo electrónico
                </label>
              </div>

              {/* Contraseña */}
              <div className="form-outline mb-4">
                <input
                  type="password"
                  id="form1Example23"
                  className="form-control form-control-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Contraseña"
                />
                <label className="form-label" htmlFor="form1Example23">
                  Contraseña
                </label>
              </div>

              {/* Recordarme */}
              <div className="d-flex justify-content-around align-items-center mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="form1Example3"
                    defaultChecked
                  />
                  <label className="form-check-label" htmlFor="form1Example3">
                    Recuérdame
                  </label>
                </div>
                <a href="#!">¿Olvidaste tu contraseña?</a>
              </div>

              {/* Botones principales */}
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block w-100 mb-2"
              >
                Entrar
              </button>

              <button
                type="button"
                onClick={handleRegister}
                className="btn btn-secondary btn-lg btn-block w-100 mb-4"
              >
                Registrar
              </button>

              {/* Separador */}
              <div className="divider d-flex align-items-center my-4">
                <p className="text-center fw-bold mx-3 mb-0 text-muted">O</p>
              </div>

              {/* Redes sociales */}
              <button
                type="button"
                className="btn btn-danger btn-lg btn-block mb-2 w-100"
                onClick={handleGoogleLogin}
              >
                <i className="fab fa-google me-2"></i>Continuar con Google
              </button>

              <a
                className="btn btn-primary btn-lg btn-block mb-2 w-100"
                style={{ backgroundColor: "#3b5998" }}
                href="#!"
                role="button"
              >
                <i className="fab fa-facebook-f me-2"></i>Continuar con Facebook
              </a>

              <a
                className="btn btn-primary btn-lg btn-block w-100"
                style={{ backgroundColor: "#55acee" }}
                href="#!"
                role="button"
              >
                <i className="fab fa-twitter me-2"></i>Continuar con Twitter
              </a>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
