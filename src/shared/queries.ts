import gql from "graphql-tag";

const userFragment = gql`
  fragment userFragment on users {
    id
    address
    name
    custom_url
    image_url
    header_image_url
    bio
    twitter_username
    twitter_verified
    twitch_username
    facebook_username
    youtube_username
    instagram_username
    tiktok_username
    personal_site
    create_time_stamp
    update_time_stamp
  }
`;

export const insertAccount = gql`
  mutation ($user: users_insert_input!) {
    insert_users(objects: [$user]) {
      affected_rows
      returning {
        ...userFragment
      }
    }
  }
  ${userFragment}
`;

export const selectAccountByUserId = gql`
  query ($id: String!) {
    users(where: { id: { _eq: $id } }) {
      ...userFragment
    }
  }
  ${userFragment}
`;
