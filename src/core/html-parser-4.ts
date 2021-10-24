// 介绍特殊操作符 rep， opt, alt

import {
  apply,
  buildLexer,
  expectEOF,
  expectSingleResult,
  kleft,
  kmid,
  kright,
  opt,
  rep,
  rule,
  seq,
  str,
  tok,
  Token,
} from 'typescript-parsec'

enum TokenKind {
  word,
  notWord,
}

const lexer = buildLexer([
  [true, /^\w+/g, TokenKind.word],
  [true, /^\W/g, TokenKind.notWord],
])

const prop = rule<TokenKind, { key: string; value: string }>()
const element = rule<
  TokenKind,
  { tagName: string; props: any; children: any }
>()

prop.setPattern(
  apply(
    seq(
      kmid(str(' '), tok(TokenKind.word), str('=')),
      kmid(str('"'), tok(TokenKind.word), str('"'))
    ),
    // 引号
    ([_key, _value]) => ({
      key: _key.text,
      value: _value.text,
    })
  )
)

element.setPattern(
  apply(
    seq(
      kright(str('<'), tok(TokenKind.word)),
      kleft(rep(prop), seq(str(' '), str('>'))),
      rep(element),
      kmid(seq(str('<'), str('/')), tok(TokenKind.word), str('>'))
    ),
    ([_tagName, _props, _children]) => ({
      tagName: _tagName.text,
      props: _props,
      children: _children,
    })
  )
)

export function parse4(input: string) {
  return expectSingleResult(expectEOF(element.parse(lexer.parse(input))))
}
