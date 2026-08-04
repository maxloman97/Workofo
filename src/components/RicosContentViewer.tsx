import { quickStartViewerPlugins, RicosViewer } from '@wix/ricos';
import '@wix/ricos/css/all-plugins-viewer.css';

const plugins = quickStartViewerPlugins();

export default function RicosContentViewer({ content }: { content: unknown }) {
  if (!content) return null;
  return (
    <div className="ricos-content">
      <RicosViewer content={content as any} plugins={plugins} />
    </div>
  );
}
