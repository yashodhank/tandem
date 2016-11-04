import { SyntheticCSSStyleRule } from "./style-rule";
import { BaseContentEdit, EditAction } from "@tandem/sandbox";
import { SyntheticCSSStyleDeclaration } from "./declaration";
import { SyntheticCSSObject, SyntheticCSSObjectSerializer } from "./base";
import {
  serialize,
  ITreeWalker,
  ISerializer,
  deserialize,
  serializable,
  ISerializedContent,
} from "@tandem/common";

export interface ISerializedSyntheticCSSFontFace {
  declaration: ISerializedContent<any>;
}

export class FontFaceEdit extends BaseContentEdit<SyntheticCSSFontFace> {
  addDiff(newAtRule: SyntheticCSSFontFace) {
    return this;
  }
}

class SyntheticCSSFontFaceSerializer implements ISerializer<SyntheticCSSFontFace, ISerializedSyntheticCSSFontFace> {
  serialize({ declaration }: SyntheticCSSFontFace) {
    return {
      declaration: serialize(declaration)
    };
  }
  deserialize({ declaration }: ISerializedSyntheticCSSFontFace, injector) {
    return new SyntheticCSSFontFace(deserialize(declaration, injector));
  }
}

@serializable(new SyntheticCSSObjectSerializer(new SyntheticCSSFontFaceSerializer()))
export class SyntheticCSSFontFace extends SyntheticCSSObject {

  constructor(public declaration: SyntheticCSSStyleDeclaration) {
    super();
    declaration.$parentRule = this;
  }

  get cssText() {
    return `@font-face {
      ${this.declaration.cssText}
    }`;
  }
  cloneShallow() {
    return new SyntheticCSSFontFace(new SyntheticCSSStyleDeclaration());
  }

  countShallowDiffs(target: SyntheticCSSFontFace) {
    return this.cssText === target.cssText ? 0 : -1;
  }

  applyEditAction(action: EditAction) {
    console.warn(`Cannot currently edit ${this.constructor.name}`);
  }

  createEdit() {
    return new FontFaceEdit(this);
  }
  visitWalker(walker: ITreeWalker) {
    walker.accept(this.declaration);
  }
}