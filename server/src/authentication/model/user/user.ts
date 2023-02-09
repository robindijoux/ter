export class User {
  id: string;
  firstName: string;
  lastName: string;
  isTeacher: boolean;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    isTeacher: boolean,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isTeacher = isTeacher;
  }
}
