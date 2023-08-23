import {
  TabNode,
  IJsonModel,
  Layout,
  Actions,
  Action,
  Model,
} from "flexlayout-react";
import { Row, Col, Tree, Button } from "antd";
import React, { FC, useCallback, useRef, useState } from "react";
import { IPluginUIModel } from "../../models/plugin";

const plugins: IPluginUIModel[] = [
  {
    id: 1,
    name: "testPluginWithouthProvider",
    description: "testPluginWithouthProvider",
    url: "https://raw.githubusercontent.com/mhmtyasr/react-plugin-package/main/WithoutProvider/build/testPluginWithouthProvider%400.1.0.js",
    libraryName: "testPluginWithouthProvider",
  },
  {
    id: 4,
    name: "testPluginWithProvider",
    description: "testPluginWithProvider",
    url: "https://raw.githubusercontent.com/mhmtyasr/react-plugin-package/main/WithProvider/build/testPluginWithProvider%400.1.1.js",
    libraryName: "testPluginWithProvider",
  },
  {
    id: 5,
    name: "Leaflet",
    description: "leafletMapPlugin",
    url: "https://raw.githubusercontent.com/mhmtyasr/react-plugin-package/main/Cesium/build/leafletMapPlugin%400.1.1.js",
    libraryName: "leafletMapPlugin",
  },
];

const getModel = () => {
  const layout = JSON.parse(
    localStorage.getItem("layout") as string
  ) as IJsonModel | null;

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
        id: "#edd84c97-a41a-433c-8f26-1007dbdccc15",
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
  };

  return (
    <div>
      <Row
        gutter={[8, 0]}
        style={{ height: "calc(100% - 52px)", marginTop: 8 }}
      >
        <Col span={4}>
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
              xs={{ offset: 22, span: 2 }}
              className="layoutButtonsContainer"
            >
              <Button type={"primary"} size="middle" onClick={onSave} block>
                Save
              </Button>
            </Col>
          </Row>
          <Layout
            ref={layoutRef}
            model={Model.fromJson(layoutJson)}
            factory={factory}
            onModelChange={(e: Model) => {
              setLayoutJson(e.toJson());
            }}
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
    </div>
  );
};

export default DesignLayout;
