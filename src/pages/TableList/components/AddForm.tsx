import {
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import {FormattedMessage, useIntl} from '@umijs/max';
import {Modal} from 'antd';
import React from 'react';

import { DownOutlined } from '@ant-design/icons';
import { Tree } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';


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

const treeData: DataNode[] = [
  {
    title: '评价体系',
    key: '0-0',
    children: [
      {
        title: '生态环境',
        key: '0-0-0',
        children: [
          {
            title: '滨水植被覆盖率与层次',
            key: '0-0-0-0',
          },
          {
            title: '生物多样性',
            key: '0-0-0-1',
          },
          {
            title: '植物的乡土性',
            key: '0-0-0-2',
          },
        ],
      },
      {
        title: '景观环境',
        key: '0-0-1',
        children: [
          {
            title: '景观小品美观度',
            key: '0-0-1-0',
          },
        ],
      },
      {
        title: '历史文化',
        key: '0-0-2',
        children: [
          {
            title: '历史文化延续性',
            key: '0-0-2-0',
          },
          {
            title: '科普教育程度',
            key: '0-0-2-1',
          },
        ],
      },
    ],
  },
];

const AddForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };
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
          name: props.values.name,
          desc: props.values.desc,
        }}
        title={'基本信息'}
      >
        <ProFormText
          name="name"
          label={'评价体系名称'}
          width="md"
          rules={[
            {
              required: true,
              message: "请输入评价体系名称！",
            },
          ]}
        />
        <ProFormTextArea
          name="desc"
          width="md"
          label={'评价体系名称'}
          placeholder={'请输入至少五个字符'}
          rules={[
            {
              required: false,
              message: (
                <FormattedMessage
                  id="pages.searchTable.updateForm.ruleDesc.descRules"
                  defaultMessage="请输入至少五个字符的规则描述！"
                />
              ),
              min: 5,
            },
          ]}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          target: '0',
          template: '0',
        }}
        title={'决策模型'}
      >
        <ProFormSelect
          name="template"
          width="md"
          label={'模板选择：'}
          valueEnum={{
            0: '无需模板',
            1: '测试模板一',
            2: '测试模板二',
          }}
        />
        准则层配置：
        <Tree
          showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={['0-0-0']}
          onSelect={onSelect}
          treeData={treeData}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          type: '1',
          frequency: 'month',
        }}
        title={'指标评分'}
      >

      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default AddForm;
