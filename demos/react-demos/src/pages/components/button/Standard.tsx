import { Button } from '@airlib/react-ui/components';

export default () => (
  <div className="flex flex-wrap gap-4 max-w-2xl mx-auto items-center justify-center">
    <Button>Filled</Button>
    <Button variant="elevated">Elevated</Button>
    <Button variant="tonal">Tonal</Button>
    <Button variant="outlined">Outlined</Button>
    <Button variant="text">Text</Button>
  </div>
);
