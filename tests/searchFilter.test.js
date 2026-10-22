import test from 'node:test';
import assert from 'node:assert/strict';

/**
 * Filter function mirroring the useMemo calculation in Gallery.jsx
 */
function filterPhotosByAuthor(photos, searchQuery) {
  const trimmed = searchQuery.trim().toLowerCase();
  if (!trimmed) {
    return photos;
  }
  return photos.filter((photo) =>
    photo.author ? photo.author.toLowerCase().includes(trimmed) : false
  );
}

const samplePhotos = [
  { id: '1', author: 'Alejandro Escamilla' },
  { id: '2', author: 'Paul Jarvis' },
  { id: '3', author: 'Tina Rataj' },
  { id: '4', author: 'Alejandro Ramos' },
  { id: '5', author: 'Danielle MacInnes' },
];

test('searchFilter - returns all photos when search query is empty', () => {
  const result = filterPhotosByAuthor(samplePhotos, '');
  assert.strictEqual(result.length, 5);
});

test('searchFilter - returns all photos when search query is whitespace only', () => {
  const result = filterPhotosByAuthor(samplePhotos, '    ');
  assert.strictEqual(result.length, 5);
});

test('searchFilter - case-insensitive author filtering', () => {
  const lowerResult = filterPhotosByAuthor(samplePhotos, 'alejandro');
  const upperResult = filterPhotosByAuthor(samplePhotos, 'ALEJANDRO');
  const mixedResult = filterPhotosByAuthor(samplePhotos, 'AleJanDro');

  assert.strictEqual(lowerResult.length, 2);
  assert.strictEqual(upperResult.length, 2);
  assert.strictEqual(mixedResult.length, 2);
  assert.deepStrictEqual(lowerResult, upperResult);
});

test('searchFilter - partial substring matches', () => {
  const result = filterPhotosByAuthor(samplePhotos, 'jar');
  assert.strictEqual(result.length, 1);
  assert.strictEqual(result[0].author, 'Paul Jarvis');
});

test('searchFilter - returns empty array when no author matches', () => {
  const result = filterPhotosByAuthor(samplePhotos, 'NonExistentAuthorNameXYZ');
  assert.strictEqual(result.length, 0);
});

test('searchFilter - preserves original photos array without mutation', () => {
  const originalCopy = [...samplePhotos];
  filterPhotosByAuthor(samplePhotos, 'Paul');
  assert.deepStrictEqual(samplePhotos, originalCopy);
});
