///<reference path='../../../../../../../test/lib/YUITest.d.ts'/>
///<reference path='../../../../../../../test/lib/puremvc-typescript-standard-1.0.d.ts'/>

///<reference path='puremvc.SimpleCommandTestCommand.ts'/>
///<reference path='puremvc.SimpleCommandTestVO.ts'/>
///<reference path='puremvc.SimpleCommandTestSub.ts'/>

module test
{
	"use strict";

	/**
	 * Test the PureMVC <code>SimpleCommand</code> class.
	 */
	export class SimpleCommandTest
	{
		/**
		 * The name of the test case - if not provided, one is automatically generated by the
		 * YUITest framework.
		 */
		name:string = "PureMVC SimpleCommand class Tests";

		/**
		 * Tests if constructing the <code>SimpleCommand</code> also call its super by testing for
		 * the existence of its <code>Notifier</code> superclass facade instance.
		 */
		testConstructor():void
		{
			// Create a new subclass of Notifier and verify that its facade has well been created
			var simpleCommandTestSub:SimpleCommandTestSub = new SimpleCommandTestSub();

			// test assertions
			YUITest.Assert.isTrue
			(
				simpleCommandTestSub.hasFacade(),
				"Expecting simpleCommandTestSub.hasFacade() === true"
			);
		}

		/**
		 * Tests the <code>execute</code> method of a <code>SimpleCommand</code>.
		 *
		 * This test creates a new <code>Notification</code>, adding a
		 * <code>SimpleCommandTestVO</code> as the body. It then creates a
		 * <code>SimpleCommandTestCommand</code> and invokes its <code>execute</code> method,
		 * passing in the note.
		 *
		 * Success is determined by evaluating a property on the object that was passed on the
		 * <code>Notification</code> body, which will be modified by the SimpleCommand.
		 */
		testSimpleCommandExecute():void
		{
			// Create the VO
			var vo:SimpleCommandTestVO = new SimpleCommandTestVO(5);

			// Create the Notification (note)
			var note:puremvc.INotification = new puremvc.Notification( 'SimpleCommandTestNote', vo );

			// Create the SimpleCommand
			var command:puremvc.ICommand = new SimpleCommandTestCommand();

			// Execute the SimpleCommand
			command.execute(note);

			// test assertions
			YUITest.Assert.areEqual
			(
				10,
				vo.result,
				"Expecting vo.result == 10"
			);
		}
	}
}