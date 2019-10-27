import 'jest';
import { JSONA } from '../JSONA';

describe('JSONA', () => {
  describe('parse', () => {
    it('outputs the same one as JSON.parse()', async () => {
      const str: string = '{"glossary":{"title":"example glossary","GlossDiv":{"title":"S","GlossList":{"GlossEntry":{"ID":"SGML","SortAs":"SGML","GlossTerm":"Standard Generalized Markup Language","Acronym":"SGML","Abbrev":"ISO 8879:1986","GlossDef":{"para":"A meta-markup language, used to create markup languages such as DocBook.","GlossSeeAlso":["GML","XML"]},"GlossSee":"markup"}}}}}';

      expect(await JSONA.parse<object>(str)).toEqual(JSON.parse(str));
    });

    it('throws error when the JSON is mal format', async () => {
      const str: string = '{"we":"you"';

      await expect(JSONA.parse<object>(str)).rejects.toThrow(SyntaxError);
    });
  });

  describe('stringify', () => {
    it('outputs the same object as JSON.stringify()', async () => {
      const obj: object = {
        'glossary': {
          'title': 'example glossary',
          'GlossDiv': {
            'title': 'S',
            'GlossList': {
              'GlossEntry': {
                'ID': 'SGML',
                'SortAs': 'SGML',
                'GlossTerm': 'Standard Generalized Markup Language',
                'Acronym': 'SGML',
                'Abbrev': 'ISO 8879:1986',
                'GlossDef': {
                  'para': 'A meta-markup language, used to create markup languages such as DocBook.',
                  'GlossSeeAlso': ['GML', 'XML']
                },
                'GlossSee': 'markup'
              }
            }
          }
        }
      };

      expect(await JSONA.stringify(obj)).toEqual(JSON.stringify(obj));
    });

    it('throws error when the JSON has circular reference', async () => {
      const obj1: any = {
      };
      const obj2: any = {
        obj1
      };
      obj1.obj2 = obj2;

      await expect(JSONA.stringify(obj1)).rejects.toThrow(TypeError);
    });
  });
});