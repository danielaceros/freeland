import { Logo } from '../common/Logo';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

const Login = () => {
  return (
    <div className="height100 flex min-h-full flex-1 flex-col justify-center bg-slate-950 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          action="#"
          method="POST"
          className="space-y-6 rounded-md bg-white bg-opacity-10 p-10"
        >
          <div className="flex justify-center">
            <Logo />
          </div>

          <div>
            <div className="mt-2">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                className="bg-white"
              />
            </div>
          </div>

          <div>
            <div className="mt-2">
              <Input
                id="password"
                type="password"
                placeholder="Contraseña"
                className="bg-white"
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              name="Sign in"
              id="Sign in"
              className="buttonFreeland flex w-full justify-center rounded-md border-2 border-freeland px-3 py-1.5 text-lg font-semibold leading-6 text-white shadow-sm hover:bg-freeland focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Acceder
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { Login };
