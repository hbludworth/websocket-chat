import app from '@/app';
import { initializeFirebase } from '@/firebase';

initializeFirebase((err) => {
  if (err) {
    console.error(err); // eslint-disable-line no-console
  } else {
    app.listen(8081, () => {
      console.log('Listening on port 8081'); // eslint-disable-line no-console
    });
  }
});
