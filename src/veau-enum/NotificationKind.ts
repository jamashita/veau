const SUCCESS: number = 1;
const INFO: number = 2;
const WARN: number = 3;
const ERROR: number = 4;

export class NotificationKind {
  private id: number;

  public static SUCCESS: NotificationKind = new NotificationKind(SUCCESS);
  public static INFO: NotificationKind = new NotificationKind(INFO);
  public static WARN: NotificationKind = new NotificationKind(WARN);
  public static ERROR: NotificationKind = new NotificationKind(ERROR);

  public static all(): Array<NotificationKind> {
    return [
      NotificationKind.SUCCESS,
      NotificationKind.INFO,
      NotificationKind.WARN,
      NotificationKind.ERROR
    ];
  }

  private constructor(id: number) {
    this.id = id;
  }

  public get(): number {
    return this.id;
  }
}
