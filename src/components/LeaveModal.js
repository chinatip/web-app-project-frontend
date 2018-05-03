import React, { Component } from 'react'
import styled from 'styled-components'
import { compose, withProps } from 'recompose'
import { Form, message } from 'antd'
import { createLeave } from 'common/services'
import { resolve } from "react-resolver"
import { Modal } from 'antd'
import _ from 'lodash'
import { FormContainer, FormItem, NavigationButton } from 'common/form'
import moment from 'moment'

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Flex = styled.div`
  display: flex;
`

const TYPES = [
  {label: 'vacation', value: 'vacation'},
  {label: 'personal', value: 'personal'},
  {label: 'sick', value: 'sick'}
]
class LoginForm extends React.Component {
  state = {}
  
  handleSubmit = (e) => {
    const { form, user, onCancel } = this.props

    e.preventDefault()
    form.validateFields(async (err, values) => {
      if (!err) {
        const body = {
          user: user._id, ...values
        }

        const { date, period} = values
        const u = await createLeave({ 
          user: user._id, 
          ...values, 
          period: {
            date: date.format('DD-MM-YYYY HH:mm'), day: period
          },
          status: 'waiting'
        })
        // console.log(u)
        onCancel()
      }
    })
  }

  render() {
    const { form, user, users } = this.props
    const { getFieldDecorator } = form

    let mUsers = _.filter(users, u => u.role === "subordinate" && u.department._id === user.department._id && u._id !== user._id )
    let subOptions = _.map(mUsers, m => ({ label: `${m.firstname} ${m.lastname}`, value: m._id}))
  
    return (
      <FormContainer width={700}>
        {/* <FormItem label={'firstname'} field={'firstname'} message={'Please input firstname'} getFieldDecorator={getFieldDecorator} /> */}
        <FormItem label={'detail'} field={'detail'} message={'Please input detail'} getFieldDecorator={getFieldDecorator} />
        <FormItem label={'type'} field={'type'} message={'Please input type'} getFieldDecorator={getFieldDecorator} options={{ options: TYPES }}/>
        <FormItem label={'substitute'} field={'substitute'} message={'Please input a substitute'} getFieldDecorator={getFieldDecorator} options={{ options: subOptions }}/>
        <FormItem label={'date'} field={'date'} message={'Please input date'} getFieldDecorator={getFieldDecorator} date/>
        <FormItem label={'how many days?'} field={'period'} message={'Please input period'} getFieldDecorator={getFieldDecorator} />
        <NavigationButton onSubmit={this.handleSubmit} last />
      </FormContainer>
    )
  }
}

const WrappedLogin = Form.create()(LoginForm)

export default ((props) => {
  const { visible, onCancel } = props
  return (
    <Modal visible={visible} onOk={onCancel} onCancel={onCancel}>
      <FormContainer>
        <WrappedLogin {...props} />
      </FormContainer>
    </Modal>
  )
})