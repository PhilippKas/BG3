import { QUESTIONS } from '../data';
import { STORY } from '../data/story';
import type { Build } from '../engine/build';

/** Short description of how far the origin questionnaire has got. */
export function originProgress(build: Build): string {
  if (build.mode === 'quick') return `${build.answered} of ${QUESTIONS.length} quick-quiz questions answered`;
  if (build.complete) return 'Story complete';
  if (build.answered === 0) return 'Story not started';
  return `Story in progress: chapter ${build.story.walk.chapterIndex + 1} of ${STORY.length}`;
}
