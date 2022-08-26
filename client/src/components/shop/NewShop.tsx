import React, { useState, ChangeEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Icon from '@mui/material/Icon'
import FileUpload from '@mui/icons-material/AddPhotoAlternate'

import auth from './../auth/auth-helper'
import { create } from './api-shop'

interface NewShop {
  name: string
  description: string
  image: File | null
  redirect: boolean
  error: string
}

const NewShop = () => {
  const [values, setValues] = useState<NewShop>({
    name: '',
    description: '',
    image: null,
    redirect: false,
    error: '',
  })
  const jwt = auth.isAuthenticated()

  const handleChange =
    (name: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files
        ? event.target.files[0]
        : event.target.value

      const value = name === 'image' ? file : event.target.value
      setValues({ ...values, [name]: value })
    }
  const clickSubmit = () => {
    const shopData = new FormData()
    values.name && shopData.append('name', values.name)
    values.description && shopData.append('description', values.description)
    values.image && shopData.append('image', values.image)

    create(
      {
        userId: jwt.user._id,
      },
      {
        t: jwt.token,
      },
      shopData
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error })
      } else {
        setValues({ ...values, error: '', redirect: true })
      }
    })
  }

  if (values.redirect) {
    return <Navigate to={'/seller/shops'} />
  }

  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h2" component="h2">
            New Shop
          </Typography>
          <br />
          <input
            accept="image/*"
            onChange={handleChange('image')}
            id="icon-button-file"
            type="file"
          />
          <label htmlFor="icon-button-file">
            <Button variant="contained" color="secondary" component="span">
              Upload Logo
              <FileUpload />
            </Button>
          </label>{' '}
          <span>{values.image ? values.image.name : ''}</span>
          <br />
          <TextField
            id="name"
            label="Name"
            value={values.name}
            onChange={handleChange('name')}
            margin="normal"
          />
          <br />
          <TextField
            id="multiline-flexible"
            label="Description"
            multiline
            rows="2"
            value={values.description}
            onChange={handleChange('description')}
            margin="normal"
          />
          <br />{' '}
          {values.error && (
            <Typography component="p" color="error">
              <Icon color="error">error</Icon>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit}>
            Submit
          </Button>
          <Link to="/seller/shops">
            <Button variant="contained">Cancel</Button>
          </Link>
        </CardActions>
      </Card>
    </div>
  )
}

export default NewShop
