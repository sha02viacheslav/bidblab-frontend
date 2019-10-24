import { Menu } from './menu.model';

export const verticalMenuItems = [
  new Menu(10, 'Home', '/', null, 'home', null, false, 0),
  new Menu(20, 'Bid', '/bid', null, 'motorcycle', null, false, 0),
  new Menu(30, 'Blab', '/blab', null, 'question_answer', null, false, 0),

  new Menu(50, 'Questions', '/account/myquestions', null, 'live_help', null, false, 1),
  new Menu(60, 'Answers', '/account/myanswers', null, 'receipt', null, false, 1),
  new Menu(70, 'Auctions', '/account/mybids', null, 'motorcycle', null, false, 1),
  new Menu(80, 'Profile', null, null, 'person', null, true, 1),
  new Menu(81, 'View Profile', '/account/viewprofile', null, 'view_agenda', null, false, 80),
  new Menu(82, 'Edit Profile', '/account/editprofile', null, 'edit', null, false, 80),
  new Menu(83, 'Following', '/account/following', null, 'live_help', null, false, 80),
  new Menu(84, 'Followers', '/account/followers', null, 'supervisor_account', null, false, 80),
  new Menu(85, 'Invite Friends', '/account/invite', null, 'person_add', null, false, 80),
  new Menu(86, 'Credits', '/account/credits', null, 'score', null, false, 80),
  new Menu(90, 'Mail', '/account/mailbox', null, 'email', null, false, 1),
]

export const horizontalMenuItems = [
  new Menu(20, 'Bid', '/bid', null, '', null, false, 0),
  new Menu(30, 'Blab', '/blab', null, '', null, false, 0),
]