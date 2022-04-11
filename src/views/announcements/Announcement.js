import React, {useEffect, useState} from 'react'
import {
  CButton,
  CFormTextarea,
  CForm,
  CFormInput,
  CFormLabel,
  CTable,
  CTableRow,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import axios from 'axios'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-build-classic-base64-upload';

function convertTimestampToString(timestamp, flag = false) {
  if (flag == false) {
      return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/ /g, '_').replace(/:/g, '_').replace(/-/g, '_')
  } else {
      return new Date(timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '')
  }
}

const baseURL = 'http://localhost'

const Announcement = () => {
  const [blogs, setBlogs] = useState([])
  const [content, setContent] = useState('')

  useEffect(async () => {
    var blogs = (await axios.get(baseURL + '/getblogs')).data

    setBlogs(blogs)
  }, [])

  console.log(window.document.querySelector('#content'))

  return (
    <>
      <CForm className="mb-3" method="post" action={baseURL + "/saveblog"} encType="multipart/form-data">
        <div className="row">
          <div className="col-sm-6">
            <CFormLabel htmlFor="formFileLg">Announcement Image</CFormLabel>
            <CFormInput type="file" name="blog_image" size="lg" id="formFileLg" required />
          </div>
          <div className="col-sm-6">
            <div className="mb-3">
              <CFormLabel htmlFor="announceTitle">Announcement Title</CFormLabel>
              <CFormInput type="text" name="blog_title" id="announceTitle" required />
            </div>
            <div className="mb-3">
              <CFormLabel htmlFor="announceDescription">Announcement Description</CFormLabel>
              <CFormTextarea name="blog_description" id="announceDescription" rows="5" required ></CFormTextarea>
            </div>
          </div>
          <input type="hidden" value={content.substr(0, 1048576)} id="content" name="content[]" maxLength="52428800" />
          <input type="hidden" value={content.substr(1048576, 1048576)} id="content" name="content[]" maxLength="52428800" />
          <input type="hidden" value={content.substr(1048576 * 2, 1048576)} id="content" name="content[]" maxLength="52428800" />
          <input type="hidden" value={content.substr(1048576 * 3, 1048576)} id="content" name="content[]" maxLength="52428800" />
          <input type="hidden" value={content.substr(1048576 * 4, 1048576)} id="content" name="content[]" maxLength="52428800" />
          <input type="hidden" value={content.substr(1048576 * 5, 1048576)} id="content" name="content[]" maxLength="52428800" />
          <div className="col-sm-12">
            <CKEditor
              editor={ ClassicEditor }
              data=""
              config={{ckfinder: {
                // Upload the images to the server using the CKFinder QuickUpload command
                // // You have to change this address to your server that has the ckfinder php connector
                // uploadUrl: '/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images&responseType=json'
              }}}
              // config={{
              //   plugins: [Base64UploadAdapter]
              // }}
              onReady={ editor => {
                  // You can store the "editor" and use when it is needed.
                  // console.log( 'Editor is ready to use!', editor );
              } }
              onChange={ ( event, editor ) => {
                  const data = editor.getData();
                  setContent(data)
                  // console.log( { event, editor, data } );
              } }
              onBlur={ ( event, editor ) => {
                  // console.log( 'Blur.', editor );
              } }
              onFocus={ ( event, editor ) => {
                  // console.log( 'Focus.', editor );
              } }
            />
          </div>
          <div className="col-sm-12">
            <CButton type="submit" color="primary" style={{width: '100px', marginTop: '20px'}}>Save</CButton>
          </div>
        </div>
      </CForm>
      <CTable bordered hover style={{background: 'white'}}>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell width="5%" scope="col">#</CTableHeaderCell>
            <CTableHeaderCell width="20%" scope="col">Image</CTableHeaderCell>
            <CTableHeaderCell width="15%" scope="col">Title</CTableHeaderCell>
            <CTableHeaderCell width="45%" scope="col">Description</CTableHeaderCell>
            <CTableHeaderCell width="10%" scope="col">Created At</CTableHeaderCell>
            <CTableHeaderCell width="5%" scope="col">Delete</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {
            blogs.map((blog, index) => {
              return <CTableRow>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell><img src={blog.blog_image} style={{width: '200px'}} /></CTableDataCell>
                <CTableDataCell>{blog.blog_title}</CTableDataCell>
                <CTableDataCell>{blog.blog_description.substr(0, 300)}...</CTableDataCell>
                <CTableDataCell>{convertTimestampToString(new Date(blog.created_at).getTime(), true)}</CTableDataCell>
                <CTableDataCell><button className="btn btn-danger" onClick={() => {
                  if (confirm('Do you want to delete announcement?')) location.href=baseURL + "/deleteblog/" + blog.blog_id }}>Delete</button></CTableDataCell>
              </CTableRow>
            })
          }
        </CTableBody>
      </CTable>
    </>
  )
}

export default Announcement
