// @ts-nocheck
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import {Modal,Tree} from 'antd';
import React, {useState} from 'react';


export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.RuleListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  addModalOpen: boolean;
  values: Partial<API.RuleListItem>;
};


const TreeNode = Tree.TreeNode

const AddForm: React.FC<UpdateFormProps> = (props) => {

  const [systemName, setSystemName] = useState('')
  const [criterions, setCriterions] = useState('')


  // 定义节点类
  class Node {
    constructor(name) {
      this.name = name;
      this.children = [];
    }
  }

  const parse = (text) => {
    // 分割为分支
    const branches = text.split(';');

    // 定义根节点
    const root = new Node(systemName);

    // 遍历每个分支
    branches.forEach(branch => {
      // 分隔节点
      const items = branch.split(':');
      const parent = new Node(items[0].trim());
      if (items.length > 1) {
        // 有子节点,继续分割
        items[1].split(',').forEach(item => {
          const child = new Node(item.trim());
          parent.children.push(child);
        });
      }
      // 加入到根节点children中
      root.children.push(parent);
    });

    return root;
  }

  const RecursiveTree = (values) => {
    console.log(values)
    const data = values.criterions;
    const systemName = values.systemName;
    const renderTreeNodes = (nodes) => {
      if (!nodes) return null;
      // console.log(nodes)
      return nodes.map(node => {
        if (node.children.length > 0) {
          return (
            <TreeNode title={node.name} key={node.name} disableCascade>
              {renderTreeNodes(node.children)}
            </TreeNode>
          );
        }

        return <TreeNode title={node.name} key={node.name} />
      })
    }

    return (
      <Tree defaultExpandAll={true} showLine={true} expandAction="expand" >
        <TreeNode title={systemName}>
          {renderTreeNodes(data.children)}
        </TreeNode>
      </Tree>
    )
  }

  return (
    <StepsForm
      stepsProps={{
        size: 'small',
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width={640}
            bodyStyle={{padding: '32px 40px 48px'}}
            destroyOnClose
            title={'新建评价体系'}
            open={props.addModalOpen}
            footer={submitter}
            onCancel={() => {
              props.onCancel();
            }}
          >
            {dom}
          </Modal>
        );
      }}
      onFinish={props.onSubmit}
    >
      <StepsForm.StepForm
        initialValues={{
          systemName: props.values.systemName,
          systemDesc: props.values.systemDesc,
        }}
        title={'基本信息'}
        onFinish={values => {
          console.log(values)
          setSystemName(values.systemName)
          return Promise.resolve(true);
        }}
      >
        <ProFormText
          name="systemName"
          label={'评价体系名称'}
          width="md"
          rules={[
            {
              // required: true,
              message: "请输入评价体系名称！",
            },
          ]}
        />
        <ProFormTextArea
          name="systemDesc"
          width="md"
          label={'评价体系名称'}
          placeholder={'请输入至少五个字符'}
          rules={[
            {
              required: false,
              message: '请输入规则描述！',
            },
          ]}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          template: '0',
          target: '0',
        }}
        onFinish={values => {
          const critText = values.critText
          const root = parse(critText);
          console.log(JSON.stringify(root, null, 2));
          setCriterions(root)
          return Promise.resolve(true);
        }}
        title={'决策模型'}
      >
        <ProFormSelect
          name="template"
          width="md"
          label={'模板选择'}
          valueEnum={{
            0: '无需模板',
            1: '测试模板一',
            2: '测试模板二',
          }}
        />

        <ProFormTextArea
          name="critText"
          width="lg"
          fieldProps={{
            rows: 8,
          }}
          label={'准则层配置'}
          placeholder={'在文本输入区域中，可以定义一个新的层次结构。\n注意: 输入区分大小写。'}
          tooltip={'\n' +
            '注意：父节点后面跟着冒号(:)，子节点用逗号分隔(,)，每个分支必须用分号结束(;)。类别和子类别的名称必须是唯一的。不允许使用数字作为类别名称。一个类别不能仅有单个子类别。输入区分大小写。'}
          rules={[
            {
              required: false,
              message: "",
            },
          ]}
        />
        配置示例如下:<br/>
        Quality: Product Variety, Product Quality Features, Production Quality;
        Reliability: Management & Organization, References, Capital, Annual Turnover;
        Service: Communication, Delivery Lead Time, Customization Capability
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          type: '1',
          frequency: 'month',
        }}
        title={'指标评分'}
      >
      <RecursiveTree criterions={criterions} systemName={systemName}/>
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default AddForm;
