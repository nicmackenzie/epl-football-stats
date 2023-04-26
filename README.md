# EPL Stats 2022/2023 season

Get stats for your favorite club for the current 2022/2023 season along with some vital club information.

## Table of contents

- [Overview](#overview)
  - [Features](#features)
  - [App functionality](#app-functionality)
- [My process](#my-process)
  - [Built with](#built-with)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### App Features

- Form input validation.
- Toggle between light and dark modes.
- Favorite a club and get its information on initial page load.

### App functionality

A user can search for any premier league club that plays in the current season,2022/2023. They use the official club name to
perform the search. If the name used isn't the official club name or its a name for a club that isn't in the premier league
in the current season, they will get an error notifying them of this. However, if they used a proper name for a club, the
app will fetch the stats and provided them to the user.

The user can then choose to like their favorite club. This will ensure that their favorite club information is populated once
they open the app. A user can only like one club at a time. If they like a different club after already liking a different club,
they will be notified of the same. However, they can choose to unlike the club at any time of their choosing and like a different club.

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Javascript

### Useful resources

- [API Football](https://www.api-football.com/) - Provided the API from which the stats where fetched from.

## Author

- Twitter - [@nckmackenzie](https://www.twitter.com/nckmackenzie)

## Acknowledgments

Big ups to the team at API football for this API.
