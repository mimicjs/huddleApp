import React, { useState } from "react";
import moment from 'moment';
// @material-ui/core components
import { MAIN_SERVER, CREATE_POST_GST_QUERY } from '../../../API/API';
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons

// core components
import GridContainer from "components/Grid/GridContainer";
import GridItem from "components/Grid/GridItem";
import CustomInput from "components/CustomInput/CustomInput";
import Button from "components/CustomButtons/Button";

import styles from "assets/jss/mkr/views/landingPageSections/workStyle";

const useStyles = makeStyles(styles);

export default function WorkSection() {
  const [createPostSuccess, setCreatePostSuccess] = useState('');
  const [createPostErrors, setCreatePostErrors] = useState([]);
  const classes = useStyles();

  async function createPost() {
    setCreatePostSuccess('');
    setCreatePostErrors([]);
    let vCreatePostOrComment_data = null;
    let vCreatePostOrComment_error = null;
    const vDocumentElementMessageBody = document.getElementById("send-message-message");
    const vBody = vDocumentElementMessageBody.value;
    if (!vBody || vBody.trim() === '') {
      setCreatePostErrors(['Message is empty']);
      return null;
    }
    await fetch((MAIN_SERVER + window.location.pathname), {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: CREATE_POST_GST_QUERY,
        variables: { Body: vBody }
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        vCreatePostOrComment_data = response.data.createPostGuest;
        if (vCreatePostOrComment_data !== null && typeof vCreatePostOrComment_data === 'object'
          && Object.keys(vCreatePostOrComment_data).length > 0 && vCreatePostOrComment_data.status === 'successful') {
          console.log("successfully created post in DB")
          const vDocumentElementMessageName = document.getElementById("send-message-name");
          const vDocumentElementMessageEmail = document.getElementById("send-message-email");
          const vDocumentElementMessageBody = document.getElementById("send-message-message");
          vDocumentElementMessageName.value = "";
          vDocumentElementMessageEmail.value = "";
          vDocumentElementMessageBody.value = "";
          setCreatePostSuccess('Thanks! Your message has been received @ ' + moment().local().format('MM/YY hh:mm A'));
        }
        else {
          console.log("failed to create post in DB")
        }
      })
      .catch((error) => {
        vCreatePostOrComment_error = error;
        let errorsArray = [];
        if (vCreatePostOrComment_error) {
          const graphQLErrors = vCreatePostOrComment_error.graphQLErrors;
          if (graphQLErrors && graphQLErrors.length > 0) {
            Object.values(Object.values(graphQLErrors[0].extensions)[0]).forEach(errorMessage => {
              errorsArray.push(errorMessage);
            })
          }
          else {
            errorsArray.push('Request issue. Please try again later');
          };
          setCreatePostErrors(errorsArray);
        }
      })
    //awaiting response from fetch
  }

  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem cs={12} sm={12} md={8}>
          <h2 className={classes.title}>Send us a message</h2>
          <h4 className={classes.description}>
            Best you email me using the email on my Resume.
            There is no email service attached but your message will be saved and displayed onto the Public General{"'"}s Discussion.
            Cheers. <br />
            - Jacky.S
          </h4>
          <form>
            <GridContainer>
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  labelText="Your Name"
                  id="send-message-name"
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={6}>
                <CustomInput
                  labelText="Your Email"
                  id="send-message-email"
                  formControlProps={{
                    fullWidth: true,
                  }}
                />
              </GridItem>
              <CustomInput
                labelText="Your Message"
                id="send-message-message"
                formControlProps={{
                  fullWidth: true,
                  className: classes.textArea,
                }}
                inputProps={{
                  multiline: true,
                  rows: 5,
                }}
              />
              <GridItem xs={12} sm={12} md={4}>
                <Button color="primary" onClick={() => createPost()}>Send Message</Button>
              </GridItem>
              <h5 className={classes.description}>
                {createPostSuccess ?? null}
                {createPostErrors ?? null}
              </h5>
            </GridContainer>
          </form>
          <br />
          <br />
          <br />
        </GridItem>
      </GridContainer>
    </div>
  );
}
