import { ErrorBoundary } from "@sentry/react";
import FlakeAppComponent from "./app/FlakeAppComponent.tsx";
import FlakeDesignerComponent from "./designer/FlakeDesignerComponent.tsx";

function App() {
  const appId: string = "tmp";

  return (
    <ErrorBoundary>
      <FlakeAppComponent appId={appId}>
        <FlakeDesignerComponent />
      </FlakeAppComponent>
    </ErrorBoundary>
  );
}

export default App;
