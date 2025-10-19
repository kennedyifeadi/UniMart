import React from "react";
import MainLayout from "./MainLayout";

function withMainLayout<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const ComponentWithLayout = (props: P) => (
    <MainLayout>
      <WrappedComponent {...props} />
    </MainLayout>
  );

  ComponentWithLayout.displayName = `withMainLayout(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return ComponentWithLayout;
}

export default withMainLayout;
