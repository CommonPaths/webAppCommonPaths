require('dotenv').config();
const polyfill = require('polyfill');
const helmet = require('helmet');
const createError = require('http-errors');
const compression = require('compression');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sequelizeMiddleware = require('./middlewares/sequelize');
const authJwtToken = require('./middlewares/authJwtToken');

const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const homeRouter = require('./routes/home');
const clientsRouter = require('./routes/clients');
const tripRequestsRouter = require('./routes/tripRequests');
const pathwayItineraryRouter = require('./routes/pathwayItinerary');
const reviewsRouter = require('./routes/reviews');
const desktopReviewsRouter = require('./routes/desktopReviews');
const fieldReviewsRouter = require('./routes/fieldReviews');
const reportsRouter = require('./routes/reports');
const dataPipelineRouter = require('./routes/dataPipeline');
const settingsRouter = require('./routes/settings');
const officersRouter = require('./routes/officers');
const lookuptablesRouter = require('./routes/lookuptables');
const healthCheckRouter = require('./routes/healthcheck');

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECURE_STRING));
app.use(express.static('public'));
app.use(express.static('views/settings.pug'));
app.use(express.static('views/layout.pug'));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(helmet.contentSecurityPolicy()); ToDo build a contentSecurityPolicy cotogno
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

// routes that do not require multitenancy
app.get('/', (req, res) => {
  res.redirect('/login');
});
app.get('/invalid_tenant', (req, res) => res.send('Access Denied'));

// routes that require multitenancy
app.use(sequelizeMiddleware());
app.use('/login', loginRouter);
app.use('/', authJwtToken());
app.use('/home', homeRouter);
app.use('/clients', clientsRouter);
app.use('/tripRequests', tripRequestsRouter);
app.use('/pathwayItinerary', pathwayItineraryRouter);
app.use('/reviews', reviewsRouter);
app.use('/desktopReviews', desktopReviewsRouter);
app.use('/fieldReviews', fieldReviewsRouter);
app.use('/reports', reportsRouter);
app.use('/dataPipeline', dataPipelineRouter);
app.use('/settings', settingsRouter);
app.use('/lookuptables', lookuptablesRouter);
app.use('/officers', officersRouter);
app.use('/healthcheck', healthCheckRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
