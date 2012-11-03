///<reference path='../../../../../../test/lib/YUITest.d.ts'/>
///<reference path='../../../../../../test/lib/puremvc-typescript-standard-1.0.d.ts'/>

///<reference path='ViewTestMediator.ts'/>
///<reference path='ViewTestMediator2.ts'/>
///<reference path='ViewTestMediator3.ts'/>
///<reference path='ViewTestMediator4.ts'/>
///<reference path='ViewTestMediator5.ts'/>
///<reference path='ViewTestMediator6.ts'/>
///<reference path='ViewTestNote.ts'/>

module test
{
	"use strict";

	/**
	 * Test the PureMVC View class.
	 */
	export class ViewTest
	{
		/**
		 * The name of the test case - if not provided, one is automatically generated by the
		 * YUITest framework.
		 */
		name:string = "PureMVC View class tests";

		/**
		 * Store the last notification name called.
		 */
		lastNotification:string = "";

		/**
		 * Used by some commands to increment calls number.
		 */
		counter:number = 0;

		/**
		 * Used by some commands to mark the onRegister method as called.
		 */
		onRegisterCalled:bool = false;

		/**
		 * Used by some commands to mark the onRemove method as called.
		 */
		onRemoveCalled:bool = false;

		/**
		 * A test variable that proves the viewTestMethod was invoked by the View.
		 */
		viewTestVar:number = 0;

		/**
		 * Tests the View singleton Factory Method
		 */
		testGetInstance():void
		{
			// Test Factory Method
			var view:puremvc.IView = puremvc.View.getInstance();

			// test assertions
			YUITest.Assert.isNotNull
			(
				view,
				"Expecting instance !== null"
			);

			YUITest.Assert.isInstanceOf
			(
				puremvc.View,
				view,
				"Expecting instance implements View"
			);
		}

		/**
		 * Tests registration and notification of Observers.
		 *
		 * An Observer is created to callback the viewTestMethod of
		 * this ViewTest instance. This Observer is registered with
		 * the View to be notified of 'ViewTestEvent' events. Such
		 * an event is created, and a value set on its payload. Then
		 * the View is told to notify interested observers of this
		 * Event.
		 *
		 * The View calls the Observer's notifyObserver method
		 * which calls the viewTestMethod on this instance
		 * of the ViewTest class. The viewTestMethod method will set
		 * an instance variable to the value passed in on the Event
		 * payload. We evaluate the instance variable to be sure
		 * it is the same as that passed out as the payload of the
		 * original 'ViewTestEvent'.
		 *
		 */
		testRegisterAndNotifyObserver():void
		{
			// Get the singleton View instance
			var view:puremvc.IView = puremvc.View.getInstance();

			// Create observer, passing in notification method and context
			var observer:puremvc.IObserver = new puremvc.Observer( this.viewTestMethod, this );

			// Register Observer's interest in a particular Notification with the View
			view.registerObserver(ViewTestNote.NAME, observer);

			// Create a ViewTestNote, setting
			// a body value, and tell the View to notify
			// Observers. Since the Observer is this class
			// and the notification method is viewTestMethod,
			// successful notification will result in our local
			// viewTestVar being set to the value we pass in
			// on the note body.
			var note:puremvc.INotification = ViewTestNote.create(10);
			view.notifyObservers(note);

			// test assertions
			YUITest.Assert.areEqual
			(
				10,
				this.viewTestVar,
				"Expecting viewTestVar = 10"
			);
		}

		/**
		 * A utility method to test the notification of Observers by the view.
		 *
		 * @param note
		 *		The note to test.
		 */
		viewTestMethod( note:puremvc.INotification )
		{
			// set the local viewTestVar to the number on the event payload
			this.viewTestVar = note.getBody();
		}

		/**
		 * Tests registering and retrieving a mediator with
		 * the View.
		 */
		testRegisterAndRetrieveMediator():void
		{
			// Get the singleton View instance
			var view:puremvc.IView = puremvc.View.getInstance();

			// Create and register the test mediator
			var viewTestMediator:puremvc.IMediator = new ViewTestMediator( this );
			view.registerMediator( viewTestMediator );

			// Retrieve the component
			var mediator:puremvc.IMediator = view.retrieveMediator( ViewTestMediator.NAME );

			// test assertions
			YUITest.Assert.isInstanceOf
			(
				ViewTestMediator,
				mediator,
				"Expecting comp is ViewTestMediator"
			);

			this.cleanup();
		}

		/**
		 * Tests the hasMediator Method
		 */
		testHasMediator():void
		{
			// register a Mediator
			var view:puremvc.IView = puremvc.View.getInstance();

			// Create and register the test mediator
			var mediator:puremvc.IMediator = new puremvc.Mediator( 'hasMediatorTest', this );
			view.registerMediator( mediator );

			// assert that the view.hasMediator method returns true
			// for that mediator name
			YUITest.Assert.isTrue
			(
				view.hasMediator('hasMediatorTest'),
				"Expecting view.hasMediator('hasMediatorTest') === true"
			);

			view.removeMediator( 'hasMediatorTest' );

			// assert that the view.hasMediator method returns false
			// for that mediator name
			YUITest.Assert.isFalse
			(
				view.hasMediator('hasMediatorTest'),
				"Expecting view.hasMediator('hasMediatorTest') === false"
			);
		}

		/**
		 * Tests registering and removing a mediator
		 */
		testRegisterAndRemoveMediator():void
		{
			// Get the singleton View instance
			var view:puremvc.IView = puremvc.View.getInstance();

			// Create and register the test mediator
			var mediator:puremvc.IMediator = new puremvc.Mediator( 'testing', this );
			view.registerMediator( mediator );

			// Remove the component
			var removedMediator:puremvc.IMediator = view.removeMediator( 'testing' );

			// assert that we have removed the appropriate mediator
			YUITest.Assert.areEqual
			(
				'testing',
				removedMediator.getMediatorName(),
				"Expecting removedMediator.getMediatorName() == 'testing'"
			);

			var retrievedMediator:puremvc.IMediator = view.retrieveMediator( 'testing' )

			// assert that the mediator is no longer retrievable
			YUITest.Assert.isNull
			(
				retrievedMediator,
				"Expecting view.retrieveMediator( 'testing' ) === null )"
			);

			this.cleanup();
		}

		/**
		 * Tests that the View callse the onRegister and onRemove methods
		 */
		testOnRegisterAndOnRemove():void
		{
			// Get the singleton View instance
			var view:puremvc.IView = puremvc.View.getInstance();

			// Create and register the test mediator
			var mediator:puremvc.IMediator = new ViewTestMediator4( this );
			view.registerMediator( mediator );

			// assert that onRegsiter was called, and the mediator responded by setting our boolean
			YUITest.Assert.isTrue
			(
				this.onRegisterCalled,
				"Expecting onRegisterCalled === true"
			);

			// Remove the component
			view.removeMediator( ViewTestMediator4.NAME );

			// assert that the mediator is no longer retrievable
			YUITest.Assert.isTrue
			(
				this.onRemoveCalled,
				"Expecting onRemoveCalled === true"
			);

			this.cleanup();
		}

		/**
		 * Tests successive regster and remove of same mediator.
		 */
		testSuccessiveRegisterAndRemoveMediator():void
		{
			// Get the singleton View instance
			var view:puremvc.IView = puremvc.View.getInstance();

			// Create and register the test mediator,
			// but not so we have a reference to it
			view.registerMediator( new ViewTestMediator( this ) );

			// test that we can retrieve it
			YUITest.Assert.isInstanceOf
			(
				ViewTestMediator,
				view.retrieveMediator( ViewTestMediator.NAME ),
				"Expecting view.retrieveMediator( ViewTestMediator.NAME ) isInstanceOf ViewTestMediator"
			);

			// Remove the Mediator
			view.removeMediator( ViewTestMediator.NAME );

			// test that retrieving it now returns null
			YUITest.Assert.isNull
			(
				view.retrieveMediator( ViewTestMediator.NAME ),
				"Expecting view.retrieveMediator( ViewTestMediator.NAME ) === null"
			);

			// test that removing the mediator again once its gone return null
			YUITest.Assert.isNull
			(
				view.removeMediator( ViewTestMediator.NAME ),
				"Expecting view.removeMediator( ViewTestMediator.NAME ) === null"
			);

			// Create and register another instance of the test mediator,
			view.registerMediator( new ViewTestMediator( this ) );

			YUITest.Assert.isInstanceOf
			(
				ViewTestMediator,
				view.retrieveMediator( ViewTestMediator.NAME ),
				"Expecting view.retrieveMediator( ViewTestMediator.NAME ) is ViewTestMediator"
			);

			// Remove the Mediator
			view.removeMediator( ViewTestMediator.NAME );

			// test that retrieving it now returns null
			YUITest.Assert.isNull
			(
				view.retrieveMediator( ViewTestMediator.NAME ),
				"Expecting view.retrieveMediator( ViewTestMediator.NAME ) === null"
			);

			this.cleanup();
		}

		/**
		 * Tests registering a Mediator for 2 different notifications, removing the
		 * Mediator from the View, and seeing that neither notification causes the
		 * Mediator to be notified. Added for the fix deployed in version 1.7
		 */
		testRemoveMediatorAndSubsequentNotify():void
		{
			// Get the singleton View instance
			var view:puremvc.IView = puremvc.View.getInstance();

			// Create and register the test mediator to be removed.
			view.registerMediator( new ViewTestMediator2( this ) );

			// test that notifications work
			view.notifyObservers( new puremvc.Notification(ViewTest.NOTE1) );
			YUITest.Assert.areEqual
			(
				ViewTest.NOTE1,
				this.lastNotification,
				"Expecting lastNotification == NOTE1"
			);

			view.notifyObservers( new puremvc.Notification(ViewTest.NOTE2) );
			YUITest.Assert.areEqual
			(
				ViewTest.NOTE2,
				this.lastNotification,
				"Expecting lastNotification == NOTE2"
			);

			// Remove the Mediator
			view.removeMediator( ViewTestMediator2.NAME );

			// test that retrieving it now returns null
			YUITest.Assert.isNull
			(
				view.retrieveMediator( ViewTestMediator2.NAME ),
				"Expecting view.retrieveMediator( ViewTestMediator2.NAME ) === null"
			);

			// test that notifications no longer work
			// (ViewTestMediator2 is the one that sets lastNotification
			// on this component, and ViewTestMediator)
			this.lastNotification = null;

			view.notifyObservers( new puremvc.Notification(ViewTest.NOTE1) );
			YUITest.Assert.areNotEqual
			(
				ViewTest.NOTE1,
				this.lastNotification,
				"Expecting lastNotification != NOTE1"
			);

			view.notifyObservers( new puremvc.Notification(ViewTest.NOTE2) );
			YUITest.Assert.areNotEqual
			(
				ViewTest.NOTE2,
				this.lastNotification,
				"Expecting lastNotification != NOTE2"
			);

			this.cleanup();
		}

		/**
		 * Tests registering one of two registered Mediators and seeing
		 * that the remaining one still responds.
		 * Added for the fix deployed in version 1.7.1
		 */
		testRemoveOneOfTwoMediatorsAndSubsequentNotify():void
		{
			// Get the singleton View instance
			var view:puremvc.IView = puremvc.View.getInstance();

			// Create and register that responds to notifications 1 and 2
			view.registerMediator( new ViewTestMediator2( this ) );

			// Create and register that responds to notification 3
			view.registerMediator( new ViewTestMediator3( this ) );

			// test that all notifications work
			view.notifyObservers( new puremvc.Notification(ViewTest.NOTE1) );
			YUITest.Assert.areEqual
			(
				ViewTest.NOTE1,
				this.lastNotification,
				"Expecting lastNotification == NOTE1"
			);

			view.notifyObservers( new puremvc.Notification(ViewTest.NOTE2) );
			YUITest.Assert.areEqual
			(
				ViewTest.NOTE2,
				this.lastNotification,
				"Expecting lastNotification == NOTE2"
			);

			view.notifyObservers( new puremvc.Notification(ViewTest.NOTE3) );
			YUITest.Assert.areEqual
			(
				ViewTest.NOTE3,
				this.lastNotification,
				"Expecting lastNotification == NOTE3"
			);

			// Remove the Mediator that responds to 1 and 2
			view.removeMediator( ViewTestMediator2.NAME );

			// test that retrieving it now returns null
			YUITest.Assert.isNull
			(
				view.retrieveMediator( ViewTestMediator2.NAME ),
				"Expecting view.retrieveMediator( ViewTestMediator2.NAME ) === null"
			);

			// test that notifications no longer work
			// for notifications 1 and 2, but still work for 3
			this.lastNotification = null;

			view.notifyObservers( new puremvc.Notification(ViewTest.NOTE1) );
			YUITest.Assert.areNotEqual
			(
				ViewTest.NOTE1,
				this.lastNotification,
				"Expecting lastNotification != NOTE1"
			);

			view.notifyObservers( new puremvc.Notification(ViewTest.NOTE2) );
			YUITest.Assert.areNotEqual
			(
				ViewTest.NOTE2,
				this.lastNotification,
				"Expecting lastNotification != NOTE2"
			);

			view.notifyObservers( new puremvc.Notification(ViewTest.NOTE3) );
			YUITest.Assert.areEqual
			(
				ViewTest.NOTE3,
				this.lastNotification,
				"Expecting lastNotification == NOTE3"
			);

			this.cleanup();
		}

		/**
		 * Tests registering the same mediator twice.
		 * A subsequent notification should only illicit
		 * one response. Also, since reregistration
		 * was causing 2 observers to be created, ensure
		 * that after removal of the mediator there will
		 * be no further response.
		 *
		 * Added for the fix deployed in version 2.0.4
		 */
		testMediatorReregistration():void
		{

			// Get the singleton View instance
			var view:puremvc.IView = puremvc.View.getInstance();

			// Create and register that responds to notification 5
			view.registerMediator( new ViewTestMediator5( this ) );

			// try to register another instance of that mediator (uses the same NAME constant).
			view.registerMediator( new ViewTestMediator5( this ) );

			// test that the counter is only incremented once (mediator 5's response)
			this.counter=0;
			view.notifyObservers( new puremvc.Notification(ViewTest.NOTE5) );
			YUITest.Assert.areEqual
			(
				1,
				this.counter,
				"Expecting counter == 1"
			);

			// Remove the Mediator
			view.removeMediator( ViewTestMediator5.NAME );

			// test that retrieving it now returns null
			YUITest.Assert.isNull
			(
				view.retrieveMediator( ViewTestMediator5.NAME ),
				"Expecting view.retrieveMediator( ViewTestMediator5.NAME ) === null"
			);

			// test that the counter is no longer incremented
			this.counter=0;
			view.notifyObservers( new puremvc.Notification(ViewTest.NOTE5) );
			YUITest.Assert.areEqual
			(
				0,
				this.counter,
				"Expecting counter == 0"
			);
		}

		/**
		 * Tests the ability for the observer list to
		 * be modified during the process of notification,
		 * and all observers be properly notified. This
		 * happens most often when multiple Mediators
		 * respond to the same notification by removing
		 * themselves.
		 *
		 * Added for the fix deployed in version 2.0.4
		 */
		testModifyObserverListDuringNotification():void
		{
			// Get the singleton View instance
			var view:puremvc.IView = puremvc.View.getInstance();

			// Create and register several mediator instances that respond to notification 6
			// by removing themselves, which will cause the observer list for that notification
			// to change.
			view.registerMediator( new ViewTestMediator6( ViewTestMediator6.NAME+"/1", this ) );
			view.registerMediator( new ViewTestMediator6( ViewTestMediator6.NAME+"/2", this ) );
			view.registerMediator( new ViewTestMediator6( ViewTestMediator6.NAME+"/3", this ) );
			view.registerMediator( new ViewTestMediator6( ViewTestMediator6.NAME+"/4", this ) );
			view.registerMediator( new ViewTestMediator6( ViewTestMediator6.NAME+"/5", this ) );
			view.registerMediator( new ViewTestMediator6( ViewTestMediator6.NAME+"/6", this ) );
			view.registerMediator( new ViewTestMediator6( ViewTestMediator6.NAME+"/7", this ) );
			view.registerMediator( new ViewTestMediator6( ViewTestMediator6.NAME+"/8", this ) );

			// clear the counter
			this.counter=0;

			// send the notification. each of the above mediators will respond by removing
			// themselves and incrementing the counter by 1. This should leave us with a
			// count of 8, since 8 mediators will respond.
			view.notifyObservers( new puremvc.Notification( ViewTest.NOTE6 ) );

			// verify the count is correct
			YUITest.Assert.areEqual
			(
				8,
				this.counter,
				"Expecting counter == 8"
			);

			// clear the counter
			this.counter=0;
			view.notifyObservers( new puremvc.Notification( ViewTest.NOTE6 ) );

			// verify the count is 0
			YUITest.Assert.areEqual
			(
				0,
				this.counter,
				"Expecting counter == 0"
			);

		}

		/**
		 * @private
		 */
		cleanup()
		{

			puremvc.View.getInstance().removeMediator( ViewTestMediator.NAME );
			puremvc.View.getInstance().removeMediator( ViewTestMediator2.NAME );
			puremvc.View.getInstance().removeMediator( ViewTestMediator3.NAME );
		}

		/**
		 * @constant
		 */
		static NOTE1:string = "Notification1";

		/**
		 * @constant
		 */
		static NOTE2:string = "Notification2";

		/**
		 * @constant
		 */
		static NOTE3:string = "Notification3";

		/**
		 * @constant
		 */
		static NOTE4:string = "Notification4";

		/**
		 * @constant
		 */
		static NOTE5:string = "Notification5";

		/**
		 * @constant
		 */
		static NOTE6:string = "Notification6";
	}
}