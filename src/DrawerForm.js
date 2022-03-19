import React, { useState } from "react";
import axios from "axios";
import { Form, Button, Col, Row, Input } from "antd";
import InputMask from "./InputMask";

function FormBuilder(props) {
  const { getFieldDecorator } = props.form;
  const [ans, setAns] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [data, setData] = useState({});
  const onlyNumbRegex = /[^\d]/g;
  const monthRegex = /\/..../;
  const yearRegex = /..\//;

  const sendData = async (e) => {
    e.preventDefault();
    console.log(data);
    try {
      await axios
        .post("http://172.20.10.3:5000/api/json/add", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((json) => {
          setAns(json.data);
        });
    } catch (error) {
      console.log(error);
    }
  };
  const checkAll = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
        setDisabled(false);
        setData(values);
      } else setDisabled(true);
    });
  };
  const checkCardNumber = (_, value) => {
    const testing = value.replace(onlyNumbRegex, "");
    if (testing.length === 16) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Length: 16"));
  };
  const checkCardCvv = (_, value) => {
    const testing = value.replace(onlyNumbRegex, "");
    if (testing.length === 3) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Length: 3"));
  };

  const checkDate = (_, value) => {
    const testing = value.replace(onlyNumbRegex, "");
    const month = Number(value.replace(monthRegex, ""));
    if (testing.length > 0 && (month > 12 || month === 0)) {
      return Promise.reject(new Error("Invalid month!"));
    }
    if (testing.length < 6) {
      return Promise.reject(new Error("Length: 6"));
    }
    const year = Number(value.replace(yearRegex, ""));
    const date = new Date();
    if (year < date.getFullYear()) {
      return Promise.reject(new Error("Out of date!"));
    }
    if (year === date.getFullYear() && month - 1 < date.getMonth()) {
      return Promise.reject(new Error("Out of date!"));
    }
    return Promise.resolve();
  };
  const checkAmount = (_, value) => {
    if (value[0] === "0") {
      return Promise.reject(new Error("Invalid value!"));
    }
    return Promise.resolve();
  };
  const onHandleChangeAmount = (e) => {
    let value = e.target.value;
    if (!Number(value)) {
      e.target.value = e.target.value.replace(onlyNumbRegex, "");
    }
  };
  return (
    <Form onChange={checkAll} onSubmit={sendData} layout="vertical">
      <Row
        gutter={4}
        type="flex"
        justify="center"
        align="middle"
        style={{ minWidth: "40vh" }}
      >
        <Col span={16} style={{ maxWidth: "400px" }}>
          <Form.Item label="Card Number">
            {getFieldDecorator("CardNumber", {
              rules: [
                { required: true, message: "Required!" },
                {
                  validator: checkCardNumber,
                },
              ],
            })(
              <InputMask
                mask="9999 9999 9999 9999"
                placeholder="____ ____ ____ ____"
              />
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row
        gutter={4}
        type="flex"
        justify="center"
        align="middle"
        style={{ minWidth: "40vh" }}
      >
        <Col span={8} style={{ maxWidth: "200px" }}>
          <Form.Item label="CVV">
            {getFieldDecorator("Cvv", {
              rules: [
                { required: true, message: "Required!" },
                {
                  validator: checkCardCvv,
                },
              ],
            })(<InputMask mask="999" placeholder="123" />)}
          </Form.Item>
        </Col>
        <Col span={8} style={{ maxWidth: "200px" }}>
          <Form.Item label="Exp. Date">
            {getFieldDecorator("ExpDate", {
              rules: [
                { required: true, message: "Required!" },
                {
                  validator: checkDate,
                },
              ],
            })(<InputMask mask="99/9999" placeholder="12/2022" />)}
          </Form.Item>
        </Col>
      </Row>
      <Row
        gutter={4}
        type="flex"
        justify="center"
        align="middle"
        style={{ minWidth: "40vh" }}
      >
        <Col span={16} style={{ maxWidth: "400px" }}>
          <Form.Item label="Amount">
            {getFieldDecorator("Amount", {
              rules: [
                { required: true, message: "Required!" },
                {
                  validator: checkAmount,
                },
              ],
            })(<Input onChange={onHandleChangeAmount} placeholder="5000" />)}
          </Form.Item>
        </Col>
      </Row>
      <Button disabled={disabled} htmlType="submit" type="primary">
        Verify Payment
      </Button>
      <Row
        gutter={4}
        type="flex"
        justify="center"
        align="middle"
        style={{ minWidth: "40vh" }}
      >
        <Col span={16} style={{ maxWidth: "400px", paddingTop: "20px" }}>
          <Form.Item label="Answer">
            <Input
              value={ans ? ans.Amount + ", " + ans.RequestId : ""}
              placeholder="Here will be answer"
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

const DrawerForm = Form.create({ name: "form" })(FormBuilder);

export default React.memo(DrawerForm);
