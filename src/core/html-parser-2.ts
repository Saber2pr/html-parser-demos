// 介绍ts-parsec

import {
  apply,
  buildLexer,
  expectEOF,
  expectSingleResult,
  opt,
  rule,
  seq,
  str,
  tok,
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
      str(' '),
      tok(TokenKind.word),
      str('='),
      str('"'),
      tok(TokenKind.word),
      str('"')
    ),
    // 引号
    ([_space, _key, _eq, _quote1, _value, _quote2]) => ({
      key: _key.text,
      value: _value.text,
    })
  )
)

element.setPattern(
  apply(
    seq(
      str('<'),
      tok(TokenKind.word),
      prop,
      str(' '),
      str('>'),
      opt(element),
      str('<'),
      str('/'),
      tok(TokenKind.word),
      str('>')
    ),
    ([
      _lt,
      _tagName,
      _props,
      _space,
      _gt,
      _children,
      _lt2,
      _slash,
      _tagName2,
      _gt2,
    ]) => ({
      tagName: _tagName.text,
      props: _props,
      children: _children,
    })
  )
)

export function parse2(input: string) {
  return expectSingleResult(expectEOF(element.parse(lexer.parse(input))))
}
