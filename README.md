# Posteoid

## Introduction

Posteoid is a traditional application built using NodeJs. It is simple, fast, secure Blog App with beautiful, responsive and user-friendly interface where users can create as many posts after creating their profile. The app also provides the functionality of editing and deleting the posts by the creator of the post. The posts made are public and anyone can read the posts and comment on them or download them as pdf file. 

## Description

### Home

The static home page welcomes the user and makes the user comfortable with the workarounds of the app.

![Home](./public/img/readme_imgs/homeSS.png)

### About

The About section is responsible for giving detailed information to the user about the creator of the app and the features and functionalities of the app. It helps the user to know the work-arounds of the app. 

This section can also be used to solve the frequently asked questions by the user. 

#### Feature 

If one wants to save the information for future reading then a feature has been added to save the data as a pdf file which can be download. For this feature **Web Scraping** has been done using the ***cheerio*** module available [here](https://www.npmjs.com/package/cheerio)

### Contact

Sometimes the user has certain queries which are not present in the _FAQs_:exclamation:. Therefore the contact section has been provided where the user can send the query message to the creator team. The messages will get stored in the database handled by the creator team which will respond to the user's query :+1:. 

The database that has been used in this project is a **mongodb** database using _mongoose_ module.

![contact](./public/img/readme_imgs/ContactSS.png)

### Login and Resgister

To use the app to create or read posts and access the various functionalities of this app one has to register themselves. The registration option is available on the login page. Error validation of the input is done and when the data is correct, it is stored in the database.

#### Features

##### Security - Encryption

The password of the respective user is encrypted and then stored in the database. During authentication the entered password is encrytped and then compared hence no decryption takes place.

##### Identity - Tokenization

When the user logs in, after validation of the login information a **token** is generated for the particular user. Sign in once and the app keeps you logged in till you log out. Once the user logs out the token will automatically be deleted. 

Detailed error validation has also been done with display of messages to the user.

First Image            |  Second Image
:-------------------------:|:-------------------------:
![Login](./public/img/readme_imgs/loginSS.png)  |  ![Login](./public/img/readme_imgs/loginSSS.png)

### User Home Page

The user lands his Home Page after successfully logging in. On the Home Page all the posts made by different users are displayed as shown below. The user can access the posts through the individual cards.

First Image            |  Second Image
:-------------------------:|:-------------------------:
![Home](./public/img/readme_imgs/userHomeSS.png)  |  ![Home](./public/img/readme_imgs/userHomeSSS.png)

### Post

The post page displays the entire content of the post created by the respective user including the masthead image uploaded.

![Post](./public/img/readme_imgs/PostSS-min.png)

#### Features

##### Edit and Delete Post

The post can be edited or deleted. Moreover only the user has the authority to edit or delete the post. Others will not be allowed. 

Appropriate error or success messages are displayed.

##### Pdf Download 

The pdf can also be generated for the post and downloaded. The style and alignment of the content has been maintained in the generated pdf file.

###### Comment Section



