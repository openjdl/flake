import { ErrorBoundary } from "@sentry/react";
import AppComponent from "./app/AppComponent.tsx";
import DesignerComponent from "./designer/DesignerComponent.tsx";

function App() {
  const appId: string = "tmp";

  return (
    <ErrorBoundary>
      <AppComponent appId={appId}>
        <DesignerComponent />
      </AppComponent>
    </ErrorBoundary>
  );
}

export default App;
