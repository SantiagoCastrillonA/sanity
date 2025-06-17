import Logo from '../../assets/logoSanity.png'
import sobreIcon from '../../assets/Icons/sobre.png'

export const LoginPage = () => {
    return (
        <div class="bg-gradient-to-b from-bg-primary from-1% via-bg-secondary via-20% to-bg-thrid to-100% h-lvh justify-center items-center flex text-center p-4">
            <div>
                <div class="flex flex-col gap-2 items-center mb-8">
                    <img src={Logo} alt="Logo" class="w-30" />
                    <h1 class="font-sanity font-semibold text-6xl text-primary">Sanity</h1>
                    <p class="text-primary text-xl font-body-sanity">Es momento de estar bien</p>
                </div>
                <form class="flex flex-col justify-center gap-3">
                    <div class="flex relative items-center" >
                        <input type="email" placeholder='Email' class="bg-amber-50 rounded-4xl w-80 h-16 py-3 pl-14 pr-4" />
                        <img class="w-7 h-7 absolute left-5" src={sobreIcon} alt="email" />
                    </div>
                    <div>
                        <input type="password" placeholder='Contraseña' class="bg-amber-50 rounded-4xl w-80 h-16 p-3"/>
                        <img src="" alt="" />
                    </div>
                    <div class="flex gap-2 mt-1 items-center">
                        <input type="checkbox" class="w-4 h-4 appearance-none border border-primary checked:bg-primary/50 checked:border-primaryfocus:outline-none" id="rememberSession"/>
                        <label class="font-body-sanity" for="rememberSession">Recordarme</label>
                        <a class="ml-9 font-body-sanity" href="">¿Olvidó su contrañesa?</a>
                    </div>
                    <div>
                        <button class="bg-secondary rounded-4xl w-auto h-auto py-3 px-6 my-4 font-sanity
                        text-neutral-50 text-3xl" >Iniciar Sesión</button>
                        <p class="font-body-sanity" >¿Primera vez? Registrate o ingresa con</p>
                        <button>Iniciar sesión con google</button>
                    </div>
                </form>
            </div>

        </div>
    )
}