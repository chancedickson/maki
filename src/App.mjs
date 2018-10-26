import * as Maki from './maki';
import * as Input from './input';

export const component = Maki.statelessComponent('App');

export function render(props) {
  return (
    <div>
      <Input name="Username" />
      <Input name="Password" type="password" />
    </div>
  );
}
