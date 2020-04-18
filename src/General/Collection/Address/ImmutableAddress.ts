import { Objet } from '../../Object/Objet';
import { AAddress } from './Abstract/AAddress';
import { Address } from './Interface/Address';

export class ImmutableAddress<E extends Objet> extends AAddress<E> implements Address<E> {
  public readonly noun: 'ImmutableAddress' = 'ImmutableAddress';

  private static readonly EMPTY: ImmutableAddress<Objet> = new ImmutableAddress(new Map<string, Objet>());

  public static of<E extends Objet>(elements: Set<E>): ImmutableAddress<E> {
    if (elements.size === 0) {
      return ImmutableAddress.empty<E>();
    }

    const map: Map<string, E> = new Map<string, E>();

    elements.forEach((e: E) => {
      map.set(e.toString(), e);
    });

    return ImmutableAddress.ofMap<E>(map);
  }

  public static ofMap<E extends Objet>(elements: Map<string, E>): ImmutableAddress<E> {
    return new ImmutableAddress<E>(elements);
  }

  public static empty<E extends Objet>(): ImmutableAddress<E> {
    return ImmutableAddress.EMPTY as ImmutableAddress<E>;
  }

  protected constructor(elements: Map<string, E>) {
    super(elements);
  }

  public add(...elements: Array<E>): Address<E> {
    const map: Map<string, E> = new Map<string, E>(this.elements);

    elements.forEach((e: E) => {
      map.set(e.hashCode(), e);
    });

    return ImmutableAddress.ofMap<E>(map);
  }

  public remove(element: E): Address<E> {
    const map: Map<string, E> = new Map<string, E>(this.elements);

    map.delete(element.hashCode());

    return ImmutableAddress.ofMap<E>(map);
  }

  public isEmpty(): boolean {
    if (this === ImmutableAddress.empty<E>()) {
      return true;
    }

    return super.isEmpty();
  }

  public duplicate(): ImmutableAddress<E> {
    return new ImmutableAddress<E>(new Map(this.elements));
  }
}
