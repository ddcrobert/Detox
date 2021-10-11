//
//  DetoxTestRunner.m
//  DetoxTestRunner
//
//  Created by Alon Haiut on 11/10/2021.
//  Copyright © 2021 Wix. All rights reserved.
//

// Unfortantly this file must be in objective C as you can't override the init(invocation: NSInvocation?) method in Swift.
// See discussion here: https://stackoverflow.com/questions/50763777/cannot-override-init-function-in-swift-xctestcase

#import <XCTest/XCTest.h>
#import "DTXLogging.h"
#import "XCTestConfiguration.h"
#import "DTXDetoxApplication.h"
#import "DetoxTestRunner-Swift.h"
#import "DetoxUtils.h"

@import Darwin;

DTX_CREATE_LOG(DetoxTestRunner);

@interface DetoxTestRunner : XCTestCase <WebSocketDelegate, DTXDetoxApplicationDelegate>

@end

@implementation DetoxTestRunner
{
	WebSocket *_webSocket;
	DTXDetoxApplication* _testedApplication;
	DTXInvocationManager* _testedApplicationInvocationManager;
	
	NSMutableArray<dispatch_block_t>* _pendingActions;
	pthread_mutex_t _pendingActionsMutex;
	dispatch_semaphore_t _pendingActionsAvailable;
	dispatch_queue_t _webSocketQueue;
}

+ (XCTestSuite *)defaultTestSuite
{
	XCTestSuite* rv = [[XCTestSuite alloc] initWithName:@"Detox Test Suite"];
	
	[rv addTest:[[DetoxTestRunner alloc] initWithSelector:@selector(testDetoxSuite)]];
	
	return rv;
}

- (instancetype)initWithSelector:(SEL)selector
{
	self = [super initWithSelector:selector];
	
	if(self)
	{
		_pendingActions = [NSMutableArray new];
		pthread_mutex_init(&_pendingActionsMutex, NULL);
		_pendingActionsAvailable = dispatch_semaphore_create(0);
		_webSocketQueue = dispatch_queue_create("com.wix.detoxTestRunner.webSocket", NULL);
		
		_webSocket = [WebSocket new];
		[_webSocket setDelegate:self];
		
		[self _reconnectWebSocket];
		
		self.continueAfterFailure = YES;
	}
	
	return self;
}

- (void)dealloc
{
	pthread_mutex_destroy(&_pendingActionsMutex);
}

- (void)_replaceActionsQueue:(NSArray<dispatch_block_t>*)actions
{
	BOOL needsSignal = NO;
	pthread_mutex_lock(&_pendingActionsMutex);
	[_pendingActions removeAllObjects];
	[_pendingActions addObjectsFromArray:actions];
	if(actions.count > 0)
	{
		needsSignal = YES;
	}
	pthread_mutex_unlock(&_pendingActionsMutex);
	
	if(needsSignal)
	{
		dispatch_semaphore_signal(_pendingActionsAvailable);
	}
}

- (void)_enqueueAction:(dispatch_block_t)action
{
	pthread_mutex_lock(&_pendingActionsMutex);
	[_pendingActions addObject:action];
	pthread_mutex_unlock(&_pendingActionsMutex);
	dispatch_semaphore_signal(_pendingActionsAvailable);
}

- (dispatch_block_t)_dequeueAction
{
	dispatch_semaphore_wait(_pendingActionsAvailable, DISPATCH_TIME_FOREVER);
	pthread_mutex_lock(&_pendingActionsMutex);
	dispatch_block_t action = _pendingActions.firstObject;
	[_pendingActions removeObjectAtIndex:0];
	pthread_mutex_unlock(&_pendingActionsMutex);
	
	return action;
}

//- (void)recordFailureWithDescription:(NSString *)description inFile:(NSString *)filePath atLine:(NSUInteger)lineNumber expected:(BOOL)expected
//{
//	NSString* tree = [_testedApplication debugDescription];
//
//	[[NSException exceptionWithName:@"DTXTestFailure" reason:@"Test execution failed" userInfo:@{@"failureReason": description, @"appTree": tree}] raise];
//}

- (void)testDetoxSuite
{
	NSLog(@"*********************************************************\nArguments: %@\n*********************************************************", NSProcessInfo.processInfo.arguments);
	
//	_testedApplication = [[DTXDetoxApplication alloc] initWithBundleIdentifier:@"com.apple.mobilesafari"];
	_testedApplication = [[DTXDetoxApplication alloc] initWithBundleIdentifier:@"com.wix.detox-example"];
	//TODO: Obtain application bundle identifier from environment variables or launch arguments.
//	_testedApplication = [[DTXDetoxApplication alloc] init];
	_testedApplication.delegate = self;
	_testedApplicationInvocationManager = [[DTXInvocationManager alloc] initWithApplication:_testedApplication];
	
//	[self webSocket:nil didReceiveAction:@"launch" withParams:nil withMessageId:@10];
//	[self webSocket:nil didReceiveAction:@"invoke" withParams:[NSDictionary dictionaryWithContentsOfURL:[[NSBundle bundleForClass:DetoxTestRunner.class] URLForResource:@"tap-bad" withExtension:@"plist"]] withMessageId:@1];
//	[self webSocket:nil didReceiveAction:@"launch" withParams:nil withMessageId:@10];
//	[self webSocket:nil didReceiveAction:@"invoke" withParams:[NSDictionary dictionaryWithContentsOfURL:[[NSBundle bundleForClass:DetoxTestRunner.class] URLForResource:@"tap" withExtension:@"plist"]] withMessageId:@2];
	
	do {
		dispatch_block_t action = [self _dequeueAction];
		action();
	} while (true);
}

- (void)_cleanUpAndTerminateIfNeeded
{
	//The web socket connection closed, so terminate all tested applications and finally exist the process.
	[_testedApplication.detoxHelper stopAndCleanupRecordingWithCompletionHandler:^ {}];
	//Only terminated tested app if debugger is not attached.
	[_testedApplication.detoxHelper isDebuggerAttachedWithCompletionHandler:^(BOOL isDebuggerAttached) {
		if(isDebuggerAttached == NO)
		{
			[self _terminateApplicationWithParameters:nil completionHandler:nil];
		}
	}];
	
	//Only exist test runner process if debugger is not attached.
	if(DTXIsDebuggerAttached() == NO)
	{
		exit(0);
	}
}

- (void)_launchApplicationWithParameters:(NSDictionary*)params completionHandler:(dispatch_block_t)completionHandler
{
	NSDictionary* userActivity = params[@"userActivity"];
	NSDictionary* userNotification = [DetoxUserNotificationParser parseUserNotificationWithDictionary:params[@"userNotification"]];
	
	_testedApplication.launchUserActivity = userActivity;
	_testedApplication.launchUserNotification = userNotification;
	_testedApplication.launchOpenURL = [NSURL URLWithString:params[@"url"]];
	_testedApplication.launchSourceApp = params[@"sourceApp"];
	
	_testedApplication.launchArguments = params[@"launchArgs"];
	
	if([params[@"newInstance"] boolValue])
	{
		[_testedApplication launch];
	}
	else
	{
		[_testedApplication activate];
	}
	
	if(completionHandler)
	{
		completionHandler();
	}
}

- (void)_terminateApplicationWithParameters:(NSDictionary*)params completionHandler:(dispatch_block_t)completionHandler
{
	[_testedApplication terminate];
	
	if(completionHandler)
	{
		completionHandler();
	}
}

- (void)_cleanupActionsQueueAndTerminateIfNeeded
{
	[self _replaceActionsQueue:@[^ {
		[self _cleanUpAndTerminateIfNeeded];
	}]];
}

#pragma mark WebSocket

- (void)_safeSendAction:(NSString*)action params:(NSDictionary*)params messageId:(NSNumber*)messageId
{
	[_webSocket sendAction:action params:params messageId:messageId];
}

- (void)_sendGeneralReadyMessage
{
	[self _safeSendAction:@"ready" params:@{} messageId:@-1000];
}

- (void)_reconnectWebSocket
{
	NSUserDefaults* options = NSUserDefaults.standardUserDefaults;
	NSString *detoxServer = [options stringForKey:@"detoxServer"];
	NSString *detoxSessionId = [options stringForKey:@"detoxSessionId"];
	
	// TODO: For debug the sessionId is currently constant.
	// Later on we will retrive it from detox server which will send with the launch command the app bundle ID (we can use the app bundle for the detox session as well)
	detoxSessionId = @"com.wix.detox-example";
	
	if(detoxServer == nil)
	{
		detoxServer = @"ws://localhost:8099";
//		dtx_log_info(@"Using default 'detoxServer': ws://localhost:8099");
	}
	
	if(detoxSessionId == nil)
	{
		detoxSessionId = XCTestConfiguration.activeTestConfiguration.targetApplicationBundleID;
//		dtx_log_info(@"Using default 'detoxSessionId': %@", detoxSessionId);
	}
	
	if(detoxSessionId == nil)
	{
		dtx_log_error(@"No detoxSessionId provided and no targetApplicationBundleID available");
	}

	NSAssert(detoxSessionId != nil, @"No detoxSessionId provided and no targetApplicationBundleID available");
	
	[_webSocket connectToServer:[NSURL URLWithString:detoxServer] withSessionId:detoxSessionId];
}

- (void)webSocketDidConnect:(WebSocket * _Nonnull)webSocket {
	[self _sendGeneralReadyMessage];
}

- (void)webSocket:(WebSocket * _Nonnull)webSocket didCloseWith:(NSString * _Nullable)reason {
	dtx_log_error(@"Web socket closed with reason: %@", reason);
	
	[self _cleanupActionsQueueAndTerminateIfNeeded];
}


- (void)webSocket:(WebSocket * _Nonnull)webSocket didFailWith:(NSError * _Nonnull)error {
	dtx_log_error(@"Web socket failed to connect with error: %@", error);
	
	//Retry server connection
	dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(1.0 * NSEC_PER_SEC)), _webSocketQueue, ^{
		[self _reconnectWebSocket];
	});
}


- (void)webSocket:(WebSocket * _Nonnull)webSocket didReceiveAction:(NSString * _Nonnull)type params:(NSDictionary<NSString *,id> * _Nonnull)params messageId:(NSNumber * _Nonnull)messageId {
	
	NSAssert(messageId != nil, @"Got action with a null messageId");
	
	if([type isEqualToString:@"testerDisconnected"])
	{
		[self _cleanupActionsQueueAndTerminateIfNeeded];
		return;
	}
	else if([type isEqualToString:@"setRecordingState"])
	{
		[self _enqueueAction:^{
			[self->_testedApplication.detoxHelper handlePerformanceRecording:params isFromLaunch:NO completionHandler:^ {
				[self _safeSendAction:@"setRecordingStateDone" params:@{} messageId:messageId];
			}];
		}];
		return;
	}
	else if([type isEqualToString:@"waitForActive"])
	{
		[self _enqueueAction:^{
			[self->_testedApplication.detoxHelper waitForApplicationState:UIApplicationStateActive completionHandler:^{
				[self _safeSendAction:@"waitForActiveDone" params:@{} messageId:messageId];
			}];
		}];
		return;
	}
	else if([type isEqualToString:@"waitForBackground"])
	{
		[self _enqueueAction:^{
			[self->_testedApplication.detoxHelper waitForApplicationState:UIApplicationStateBackground completionHandler:^{
				[self _safeSendAction:@"waitForBackgroundDone" params:@{} messageId:messageId];
			}];
		}];
		return;
	}
	else if([type isEqualToString:@"invoke"])
	{
		[self _enqueueAction:^{
			[self->_testedApplication waitForIdleWithTimeout:0];
			@try
			{
				NSDictionary* rv = [self->_testedApplicationInvocationManager invokeWithDictionaryRepresentation:params];
				if(rv == nil)
				{
					rv = @{};
				}
				
				[self _safeSendAction:@"invokeResult" params:@{@"result": rv} messageId:messageId];
			}
			@catch(NSException* exception)
			{
				NSMutableDictionary* params = @{@"details": exception.reason}.mutableCopy;
				if([exception.name isEqualToString:@"DTXTestFailure"])
				{
					[params addEntriesFromDictionary:exception.userInfo];
				}
				
				[self _safeSendAction:@"testFailed" params:params messageId:messageId];
			}
		}];
		return;
	}
	else if([type isEqualToString:@"isReady"])
	{
		[self _sendGeneralReadyMessage];
		return;
	}
	else if([type isEqualToString:@"cleanup"])
	{
		//TODO: ???
		[self _safeSendAction:@"cleanupDone" params:@{} messageId:messageId];
		return;
	}
	else if([type isEqualToString:@"launch"])
	{
		[self _enqueueAction:^{
			[self _launchApplicationWithParameters:params completionHandler:^{
				[self _safeSendAction:@"launchDone" params:@{} messageId:messageId];
			}];
		}];
		return;
	}
	else if([type isEqualToString:@"terminate"])
	{
		[self _enqueueAction:^{
			[self _terminateApplicationWithParameters:params completionHandler:^{
				[self _safeSendAction:@"terminateDone" params:@{} messageId:messageId];
			}];
		}];
		return;
	}
	else if([type isEqualToString:@"deliverPayload"])
	{
		[self _enqueueAction:^{
			[self->_testedApplication.detoxHelper deliverPayload:params completionHandler:^{
				[self _safeSendAction:@"deliverPayloadDone" params:@{} messageId:messageId];
			}];
		}];
		return;
	}
	else if([type isEqualToString:@"setOrientation"])
	{
		[self _enqueueAction:^{
			[XCUIDevice.sharedDevice setOrientation:[params[@"orientation"] unsignedIntegerValue]];
		}];
		return;
	}
	else if([type isEqualToString:@"shakeDevice"])
	{
		//TODO: Implement shake!
		return;
	}
	else if([type isEqualToString:@"reactNativeReload"])
	{
		[self _enqueueAction:^{
			[self->_testedApplication.detoxHelper reloadReactNativeWithCompletionHandler:^{
				[self _safeSendAction:@"reactNativeReloadDone" params:@{} messageId:messageId];
			}];
		}];
		return;
	}
	else if([type isEqualToString:@"currentStatus"])
	{
		//TODO: Format changed!
		[_testedApplication.detoxHelper syncStatusWithCompletionHandler:^(NSString * _Nonnull information) {
			[self _safeSendAction:@"currentStatusResult" params:@{@"messageId": messageId, @"syncStatus": information} messageId:messageId];
		}];
		return;
	}
	else if([type isEqualToString:@"terminateTestRunner"])
	{
		[self _cleanupActionsQueueAndTerminateIfNeeded];
	}
}

#pragma mark DTXDetoxApplicationDelegate

- (void)application:(DTXDetoxApplication *)application didCrashWithDetails:(NSDictionary *)details
{
	[self _safeSendAction:@"AppWillTerminateWithError" params:details messageId:@-10000];
}

@end
