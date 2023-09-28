import React, { useCallback, useMemo, useRef, useState } from "react";
import { useApp } from "../app/AppContext.tsx";
import { DesignerContext } from "./DesignerContext.tsx";
import {
  AppStatus,
  FlakeDesigner,
  IDesignerComponent,
  IDesignerDraggable,
  IDesignerDragging,
  IDesignerDroppable,
  IDesignerHovering,
  IDesignerResizing,
  IDesignerSelecting,
} from "../typings";
import { Constants } from "../app/Constants.ts";
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { useDesignerDroppable } from "./useDesignerDroppable.ts";
import { useDesignerDraggable } from "./useDesignerDraggable.ts";
import { useDesignerHovering } from "./useDesignerHovering.ts";
import { useDesignerDragging } from "./useDesignerDragging.ts";
import { useDesignerSelecting } from "./useDesignerSelecting.ts";
import { useDesignerResizing } from "./useDesignerResizing.ts";
import { useDesignerComponent } from "./useDesignerComponent.ts";
import DesignerHeader from "./DesignerHeader.tsx";

const DesignerComponent: React.FC = () => {
  const app = useApp();
  const [, setViewport, viewportSize] = app.useViewport();
  const [previewing, setPreviewing] = useState<boolean>(false);
  const [menuWidth, setMenuWidth] = useState<number>(
    Constants.designer.menuWidth,
  );
  const [propertiesEditorWidth, setPropertiesEditorWidth] = useState<number>(
    Constants.designer.propertiesEditorWidth,
  );
  const contentWidth = useMemo<number>(
    () => viewportSize.width - menuWidth - propertiesEditorWidth,
    [viewportSize.width, menuWidth, propertiesEditorWidth],
  );
  const height = useMemo(
    () => viewportSize.height - Constants.designer.headerHeight,
    [viewportSize.height],
  );
  const designerRef = useRef<FlakeDesigner>();

  const droppable: IDesignerDroppable = useDesignerDroppable();
  const draggable: IDesignerDraggable = useDesignerDraggable();
  const hovering: IDesignerHovering = useDesignerHovering();
  const dragging: IDesignerDragging = useDesignerDragging();
  const selecting: IDesignerSelecting = useDesignerSelecting(app);
  const resizing: IDesignerResizing = useDesignerResizing();
  const component: IDesignerComponent = useDesignerComponent(app, selecting);
  const saving: boolean = false; // TODO: code.saving

  const debugPrint = useCallback(() => {
    app.debugPrint();

    // TODO: designer 数据
  }, [app]);

  designerRef.current = useMemo(
    () => ({
      app,
      saving,
      get previewing(): boolean {
        return previewing;
      },
      set previewing(value: boolean) {
        setPreviewing(value);
        app.debug("SetPreviewing", value);
      },
      get menuWidth(): number {
        return menuWidth;
      },
      set menuWidth(value: number) {
        setMenuWidth(value);
        app.debug("SetMenuWidth", value);
      },
      get propertiesEditorWidth(): number {
        if (previewing) {
          return 0;
        } else {
          return propertiesEditorWidth;
        }
      },
      set propertiesEditorWidth(value: number) {
        setPropertiesEditorWidth(value);
        app.debug("SetPropertiesEditorWidth", value);
      },
      get contentWidth(): number {
        if (previewing) {
          return contentWidth + propertiesEditorWidth;
        } else {
          return contentWidth;
        }
      },
      get height(): number {
        return height;
      },
      droppable,
      draggable,
      hovering,
      dragging,
      selecting,
      resizing,
      component,
      debugPrint,
    }),
    [
      app,
      saving,
      previewing,
      menuWidth,
      propertiesEditorWidth,
      contentWidth,
      height,
      droppable,
      draggable,
      hovering,
      dragging,
      selecting,
      resizing,
      component,
      debugPrint,
    ],
  );

  return (
    <DesignerContext.Provider value={designerRef.current!}>
      <div ref={setViewport} style={{ width: "100vw", height: "100vh" }}>
        {app.status === AppStatus.Loading ? (
          <Center w="100vw" h="100vh">
            <VStack>
              <Spinner />
              <Text fontSize="lg">加载中...</Text>
            </VStack>
          </Center>
        ) : app.status === AppStatus.LoadFailed ? (
          <Center w="100vw" h="100vh">
            <Text fontSize="lg" color="red">
              加载失败
            </Text>
          </Center>
        ) : (
          <>
            <DesignerHeader />
          </>
        )}
      </div>
    </DesignerContext.Provider>
  );
};

export default DesignerComponent;
