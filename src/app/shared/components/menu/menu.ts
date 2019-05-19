import { Menu } from './menu.model';

export const verticalMenuItems = [
  new Menu(10, 'Home', '/questions/home', null, 'home', null, false, 0),
  new Menu(20, 'Bid', '/questions/bid', null, 'motorcycle', null, false, 0),
  new Menu(30, 'Blab', '/questions/blab', null, 'question_answer', null, false, 0),
  new Menu(40, 'About', '/questions/about', null, 'live_help', null, false, 0),
  new Menu(50, 'Following', '/account/following', null, 'live_help', null, false, 1),
  new Menu(60, 'Followers', '/account/followers', null, 'supervisor_account', null, false, 1),
  new Menu(70, 'My Bids', '/account/mybids', null, 'motorcycle', null, false, 1),
  new Menu(80, 'My Questions', '/account/myquestions', null, 'live_help', null, false, 1),
  new Menu(90, 'My answers', '/account/myanswers', null, 'receipt', null, false, 1),
  new Menu(100, 'Credits', '/account/credits', null, 'score', null, false, 1),
  new Menu(110, 'Profile', null, null, 'person', null, true, 1),
  new Menu(111, 'View Profile', '/account/viewprofile', null, 'view_agenda', null, false, 110),
  new Menu(112, 'Edit Profile', '/account/editprofile', null, 'edit', null, false, 110),
  new Menu(120, 'Mail', '/account/mailbox', null, 'email', null, false, 1),
  new Menu(120, 'Invite Friend', '/extra/invite', null, 'person_add', null, false, 2),
]

export const horizontalMenuItems = []