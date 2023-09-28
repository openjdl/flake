import React from "react";
import { useDesigner } from "./DesignerContext.tsx";
import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  SimpleGrid,
  useToast,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Constants } from "../app/Constants.ts";

const DesignerHeader: React.FC = () => {
  const designer = useDesigner();
  const toast = useToast();

  const onRename = (name: string) => {
    if (designer.app.name !== name) {
      if (name.length > 0) {
        designer.app.name = name;
      }
    }
  };

  const onClickDebugPrint = () => {
    designer.debugPrint();
  };

  const onClickPreview = () => {
    designer.previewing = !designer.previewing;
  };

  const onClickSave = () => {
    designer.app
      .save()
      .then((successful) => {
        if (successful) {
          toast({
            title: "保存成功",
            position: "top",
            status: "success",
          });
        } else {
          toast({
            title: "保存失败",
            position: "top",
            status: "error",
          });
        }
      })
      .catch((e: any) => {
        console.log(e);
        toast({
          title: e.message ?? "保存失败",
          position: "top",
          status: "error",
        });
      });
  };

  return (
    <SimpleGrid
      height={`${Constants.designer.headerHeight}px`}
      paddingLeft="16px"
      paddingRight="16px"
      backgroundColor="#fff"
      borderBottom="1px solid #cdd5df"
      boxShadow="none"
      zIndex={Constants.designer.zHeader}
      columns={2}
    >
      <Wrap justify="start" height={`${Constants.designer.headerHeight}px`}>
        <WrapItem>
          <Editable defaultValue={designer.app.name} onChange={onRename}>
            <EditablePreview />
            <EditableInput />
          </Editable>
        </WrapItem>
      </Wrap>

      <Wrap justify="end" height={`${Constants.designer.headerHeight}px`}>
        {designer.app.debugging && (
          <WrapItem>
            <Button size="sm" variant="ghost" onClick={onClickDebugPrint}>
              DebugPrint
            </Button>
          </WrapItem>
        )}

        <WrapItem>
          <Button size="sm" variant="ghost" onClick={onClickPreview}>
            {designer.previewing ? "退出预览" : "预览"}
          </Button>
        </WrapItem>
      </Wrap>
    </SimpleGrid>
  );
};

export default DesignerHeader;
