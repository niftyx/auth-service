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

export const insertRefreshToken = gql`
  mutation ($refresh_token_data: refresh_tokens_insert_input!) {
    insert_refresh_tokens_one(object: $refresh_token_data) {
      refresh_token
    }
  }
`;

export const selectRefreshToken = gql`
  query ($refresh_token: uuid!, $current_timestamp: timestamptz!) {
    auth_refresh_tokens(
      where: {
        _and: [
          { refresh_token: { _eq: $refresh_token } }
          { expires_at: { _gte: $current_timestamp } }
        ]
      }
    ) {
      refresh_token
    }
  }
`;

export const accountOfRefreshToken = gql`
  query ($refresh_token: uuid!) {
    auth_refresh_tokens(
      where: { _and: [{ refresh_token: { _eq: $refresh_token } }] }
    ) {
      account {
        ...userFragment
      }
    }
  }
  ${userFragment}
`;

export const updateRefreshToken = gql`
  mutation (
    $old_refresh_token: uuid!
    $new_refresh_token_data: auth_refresh_tokens_insert_input!
  ) {
    delete_auth_refresh_tokens(
      where: { refresh_token: { _eq: $old_refresh_token } }
    ) {
      affected_rows
    }
    insert_auth_refresh_tokens(objects: [$new_refresh_token_data]) {
      affected_rows
    }
  }
`;

export const deleteAllAccountRefreshTokens = gql`
  mutation ($user_id: uuid!) {
    delete_auth_refresh_tokens(
      where: { account: { user: { id: { _eq: $user_id } } } }
    ) {
      affected_rows
    }
  }
`;

export const deleteRefreshToken = gql`
  mutation ($refresh_token: uuid!) {
    delete_auth_refresh_tokens(
      where: { refresh_token: { _eq: $refresh_token } }
    ) {
      affected_rows
    }
  }
`;
