import mock from '@/@fake-db/mock'
/* eslint-disable global-require */
const data = {
  profileData: {
    header: {
      username: 'Kitty Allanson',
      designation: 'UI/UX Designer',
    },
    userAbout: {
      about:
        'Tart I love sugar plum I love oat cake. Sweet ⭐️ roll caramels I love jujubes. Topping cake wafer.',
      joined: 'November 15, 2015',
      lives: 'New York, USA',
      email: 'bucketful@fiendhead.org',
      website: 'www.pixinvent.com',
    },
    suggestedPages: [
      {
        username: 'Peter Reed',
        subtitle: 'Company',
        favorite: false,
      },
      {
        username: 'Harriett Adkins',
        subtitle: 'Company',
        favorite: false,
      },
      {
        username: 'Juan Weaver',
        subtitle: 'Company',
        favorite: false,
      },
      {
        username: 'Claudia Chandler',
        subtitle: 'Company',
        favorite: false,
      },
      {
        username: 'Earl Briggs',
        subtitle: 'Company',
        favorite: true,
      },
      {
        username: 'Jonathan Lyons',
        subtitle: 'Beauty Store',
        favorite: false,
      },
    ],
    twitterFeeds: [
      {
        title: 'Gertrude Stevens',
        id: 'tiana59 ',
        tags: '#design #fasion',
        desc: 'I love cookie chupa chups sweet tart apple pie ⭐️ chocolate bar.',
        favorite: false,
      },
      {
        title: 'Lura Jones',
        id: 'tiana59 ',
        tags: '#vuejs #code #coffeez',
        desc: 'Halvah I love powder jelly I love cheesecake cotton candy. 😍',
        favorite: true,
      },
      {
        title: 'Norman Gross',
        id: 'tiana59 ',
        tags: '#sketch #uiux #figma',
        desc: 'Candy jelly beans powder brownie biscuit. Jelly marzipan oat cake cake.',
        favorite: false,
      },
    ],
    post: [
      {
        username: 'Leeanna Alvord',
        postTime: '12 Dec 2018 at 1:16 AM',
        postText:
          'Wonderful Machine· A well-written bio allows viewers to get to know a photographer beyond the work. This can make the difference when presenting to clients who are looking for the perfect fit.',
        likes: 1240,
        youLiked: true,
        comments: 1240,
        share: 1240,
        likedUsers: [
          {
            username: 'Trine Lynes',
          },
          {
            username: 'Lilian Nenes',
          },
          {
            username: 'Alberto Glotzbach',
          },
          {
            username: 'George Nordic',
          },
          {
            username: 'Vinnie Mostowy',
          },
        ],
        likedCount: 140,
        detailedComments: [
          {
            username: 'Kitty Allanson',
            comment:
              'Easy & smart fuzzy search🕵🏻 functionality which enables users to search quickly.',
            commentsLikes: 34,
            youLiked: false,
          },
          {
            username: 'Jackey Potter',
            comment:
              'Unlimited color🖌 options allows you to set your application color as per your branding 🤪.',
            commentsLikes: 61,
            youLiked: true,
          },
        ],
      },
      {
        username: 'Rosa Walters',
        postTime: '11 Dec 2019 at 1:16 AM',
        postText:
          'Wonderful Machine· A well-written bio allows viewers to get to know a photographer beyond the work. This can make the difference when presenting to clients who are looking for the perfect fit.',
        likes: 1240,
        youLiked: true,
        comments: 1240,
        share: 1240,
        likedUsers: [
          {
            username: 'Trine Lynes',
          },
          {
            username: 'Lilian Nenes',
          },
          {
            username: 'Alberto Glotzbach',
          },
          {
            username: 'George Nordic',
          },
          {
            username: 'Vinnie Mostowy',
          },
        ],
        likedCount: 271,
        detailedComments: [
          {
            username: 'Kitty Allanson',
            comment:
              'Easy & smart fuzzy search🕵🏻 functionality which enables users to search quickly.',
            commentsLikes: 34,
            youLiked: false,
          },
        ],
      },
      {
        username: 'Charles Watson',
        postTime: '12 Dec 2019 at 1:16 AM',
        postText:
          'Wonderful Machine· A well-written bio allows viewers to get to know a photographer beyond the work. This can make the difference when presenting to clients who are looking for the perfect fit.',
        postVid: 'https://www.youtube.com/embed/6stlCkUDG_s',
        likes: 1240,
        youLiked: true,
        comments: 1240,
        share: 1240,
        likedUsers: [
          {
            username: 'Trine Lynes',
          },
          {
            username: 'Lilian Nenes',
          },
          {
            username: 'Alberto Glotzbach',
          },
          {
            username: 'George Nordic',
          },
          {
            username: 'Vinnie Mostowy',
          },
        ],
        likedCount: 264,
        detailedComments: [
          {
            username: 'Kitty Allanson',
            comment:
              'Easy & smart fuzzy search🕵🏻 functionality which enables users to search quickly.',
            commentsLikes: 34,
            youLiked: false,
          },
        ],
      },
    ],
    latestPhotos: [],
    suggestions: [
      {
        name: 'Peter Reed',
        mutualFriend: '6 Mutual Friends',
      },
      {
        name: 'Harriett Adkins',
        mutualFriend: '3 Mutual Friends',
      },
      {
        name: 'Juan Weaver',
        mutualFriend: '1 Mutual Friends',
      },
      {
        name: 'Claudia Chandler',
        mutualFriend: '16 Mutual Friends',
      },
      {
        name: 'Earl Briggs',
        mutualFriend: '4 Mutual Friends',
      },
      {
        name: 'Jonathan Lyons',
        mutualFriend: '25 Mutual Friends',
      },
    ],
    polls: [
      {
        name: 'RDJ',
        result: '82%',
        votedUser: [
          {
            username: 'Tonia Seabold',
          },
          {
            username: 'Carissa Dolle',
          },
          {
            username: 'Kelle Herrick',
          },
          {
            username: 'Len Bregantini',
          },
        ],
      },
      {
        name: 'Chris Hemswort',
        result: '67%',
        votedUser: [
          {
            username: 'Tonia Seabold',
          },
          {
            username: 'Carissa Dolle',
          },
          {
            username: 'Jonathan Lyons',
          },
        ],
      },
    ],
  },
}
/* eslint-disable global-require */
mock.onGet('/profile/data').reply(() => [200, data.profileData])
