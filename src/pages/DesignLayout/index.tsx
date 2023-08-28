import {
  TabNode,
  IJsonModel,
  Layout,
  Actions,
  Action,
  Model,
} from "flexlayout-react";
import { Row, Col, Tree, Button, TourProps, Tour, notification } from "antd";
import  { FC, useCallback, useEffect, useRef, useState } from "react";
import { IPluginUIModel } from "../../models/plugin";
import {  useNavigate } from "react-router-dom";

//Default Plugins from github
const plugins: IPluginUIModel[] = [
  {
    id: 1,
    name: "testPluginWithoutProvider",
    description: "testPluginWithouthProvider",
    url: "https://raw.githubusercontent.com/mhmtyasr/react-plugin-packages/main/WithoutProvider/build/testPluginWithouthProvider%400.1.0.js",
    libraryName: "testPluginWithouthProvider",
  },
  {
    id: 4,
    name: "testPluginWithProvider",
    description: "testPluginWithProvider",
    url: "https://raw.githubusercontent.com/mhmtyasr/react-plugin-packages/main/WithProvider/build/testPluginWithProvider%400.1.1.js",
    libraryName: "testPluginWithProvider",
  },
  {
    id: 5,
    name: "Leaflet",
    description: "leafletMapPlugin",
    url: "https://raw.githubusercontent.com/mhmtyasr/react-plugin-packages/main/LeafletMap/build/leafletMapPlugin%400.1.1.js",
    libraryName: "leafletMapPlugin",
  },
];

const getModel = () => {
  const layout = JSON.parse(
    localStorage.getItem("layout") as string
  ) as IJsonModel | null;

  //Default LAyout
  if (layout === null) {
    return {
      global: {
        borderMinSize: 100,
        tabEnableFloat: true,
        tabSetMinWidth: 100,
        tabSetMinHeight: 100,
        tabSetEnableMaximize: false,
      },
      layout: {
        id: "#",
        type: "row",
        children: [],
      },
      borders: [
        {
          type: "border",
          location: "top",
          children: [],
        },
        {
          type: "border",
          location: "left",
          children: [],
        },
        {
          type: "border",
          location: "right",
          children: [],
        },
      ],
    } as IJsonModel;
  } else {
    return layout;
  }
};
const DesignLayout: FC = () => {
  const [layoutJson, setLayoutJson] = useState<IJsonModel>(getModel());
  const [selectedKeys, setSelectedKeys] = useState<number[]>([]);

  const factory = useCallback((node: TabNode) => {
    const component = node.getComponent();
    switch (component) {
      case "plugin":
        return <div>Plugin</div>;
      default:
        return <div>{node.getName()}</div>;
    }
  }, []);

  const layoutRef = useRef<Layout>(null);
  const treeRef = useRef<any>(null);

  const saveButtonRef = useRef<any>(null);

  const gotoButtonRef = useRef<any>(null);

  const [open, setOpen] = useState<boolean>(false);

  const steps: TourProps["steps"] = [
    {
      title: "Drag and Drop",
      description: "Drag and drop plugins from left to right",
      target: () => treeRef.current,
    },
    {
      title: "Save",
      description: "Save",
      target: () => saveButtonRef.current,
    },
    {
      title: "Go to",
      description: "Go to",
      target: () => gotoButtonRef.current,
    },
  ];

  useEffect(() => {
    setOpen(true);
  }, []);

  const onAddPluginLayout = useCallback(
    (e: number) => {
      const tempPlugins = plugins.find((plugin) => {
        return plugin.id === e;
      });

      if (!tempPlugins) return;

      layoutRef.current?.addTabWithDragAndDrop(
        `Add ${tempPlugins.name}<br>(Drag to location)`,
        {
          enableClose: true,
          enableFloat: false,
          enableDrag: true,
          component: "plugin",
          enableRename: false,
          id: tempPlugins.id.toString(),
          name: `${tempPlugins.name}`,
          config: tempPlugins,
        },
        () => {
          setSelectedKeys([...selectedKeys, e]);
        }
      );
    },
    [plugins, selectedKeys]
  );

  const onSave = () => {
    localStorage.setItem("layout", JSON.stringify(layoutJson));
    notification.success({
      message: "Layout Saved",
    });
  };

  return (
    <div>
      <Row
        gutter={[8, 0]}
        style={{ height: "calc(100% - 52px)", marginTop: 8 }}
      >
        <Col span={4} ref={treeRef}>
          <Tree
            style={{ marginTop: 20 }}
            multiple
            checkable={false}
            height={350}
            treeData={plugins.map((x) => {
              return {
                title: x.name,
                key: x.id,
              };
            })}
            onSelect={(e, k) => {
              if (e.length > 0) {
                onAddPluginLayout(k.node.key as number);
              }
            }}
            selectedKeys={selectedKeys}
            titleRender={(node) => {
              return (
                <div>
                  <span>{node.title}</span>
                </div>
              );
            }}
          />
        </Col>
        <Col span={20}>
          <Row gutter={[16, 0]}>
            <Col
              xs={{ offset: 20, span: 2 }}
              className="layoutButtonsContainer"
            >
              <Button
                type={"primary"}
                size="middle"
                onClick={onSave}
                block
                ref={saveButtonRef}
              >
                Save
              </Button>
            </Col>
            <Col xs={{ offset: 0, span: 2 }} className="layoutButtonsContainer">
              <Button
                type={"primary"}
                size="middle"
                block
                ref={gotoButtonRef}
                onClick={() => {
                  window.location.href = "/show";
                }}
              >
                Go to
              </Button>
            </Col>
          </Row>
          <Layout
            model={Model.fromJson(layoutJson)}
            factory={factory}
            onModelChange={(e: Model) => {
              setLayoutJson(e.toJson());
            }}
            ref={layoutRef}
            onAction={(action: Action) => {
              if (action.type === Actions.DELETE_TAB) {
                setSelectedKeys([
                  ...selectedKeys.filter(
                    (x) => x !== parseInt(action.data.node)
                  ),
                ]);
              }
              return action;
            }}
          />
        </Col>
      </Row>
      <Tour
        scrollIntoViewOptions={{ behavior: "smooth", block: "center" }}
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
      />
    </div>
  );
};

export default DesignLayout;
