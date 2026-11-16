/**
 * A yes/no question about a candidate that can be combined with others.
 * Every filter on the shelf is one of these; the shelf just asks the combined question.
 */
export abstract class Specification<T> {
  abstract isSatisfiedBy(candidate: T): boolean;

  and(other: Specification<T>): Specification<T> {
    return new AllOf([this, other]);
  }

  or(other: Specification<T>): Specification<T> {
    return new AnyOf([this, other]);
  }

  not(): Specification<T> {
    return new Not(this);
  }
}

/** Matches when every part matches. With no parts, matches everything. */
export class AllOf<T> extends Specification<T> {
  constructor(private readonly parts: readonly Specification<T>[]) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return this.parts.every((part) => part.isSatisfiedBy(candidate));
  }
}

/** Matches when at least one part matches. With no parts, matches nothing. */
export class AnyOf<T> extends Specification<T> {
  constructor(private readonly parts: readonly Specification<T>[]) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return this.parts.some((part) => part.isSatisfiedBy(candidate));
  }
}

export class Not<T> extends Specification<T> {
  constructor(private readonly inner: Specification<T>) {
    super();
  }

  isSatisfiedBy(candidate: T): boolean {
    return !this.inner.isSatisfiedBy(candidate);
  }
}
