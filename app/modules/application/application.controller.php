<?php

class ApplicationController extends BaseController {

    public static $name = 'application';
    public static $group = 'application';
    public static $global_cache_min = 10;

    /****************************************************************************/

    ## Routing rules of module
    public static function returnRoutes($prefix = null) {

        $dics_for_cache = ['projects', 'types'];
        foreach ($dics_for_cache as $dic_name) {

            ## Refresh dics cache
            #Cache::forget('dic_' . $dic_name);

            $dic_{$dic_name} = Cache::get('dic_' . $dic_name);
            if (!$dic_{$dic_name}) {

                Cache::forget('dic_' . $dic_name);

                $dic_{$dic_name} = Dic::valuesBySlug($dic_name, function($query){ $query->orderBy('lft', 'ASC'); }, ['allfields', 'alltextfields'], true, true, true);
                #Helper::d($dic_name); Helper::ta($dic_{$dic_name}); #die;

                $dic_{$dic_name} = DicLib::loadImages($dic_{$dic_name}, ['avatar', 'image', 'logo', 'photo', 'header_img']);
                #Helper::d($dic_name); Helper::ta($dic_{$dic_name}); #die;

                Cache::add('dic_' . $dic_name, $dic_{$dic_name}, self::$global_cache_min);
            }
            View::share('dic_' . $dic_name, $dic_{$dic_name});

            #Helper::d($dic_name); Helper::ta($dic_{$dic_name});
        }
        #Helper::tad($dic_{'city'});
        #die;


        Route::group(array('prefix' => '{lang}'), function() {

            Route::any('/project/{slug}', array('as' => 'app.project', 'uses' => __CLASS__.'@appProject'));

            #Route::any('/ajax/send-message', array('as' => 'ajax.send-message', 'uses' => __CLASS__.'@postSendMessage'));
            #Route::any('/ajax/some-action', array('as' => 'ajax.some-action', 'uses' => __CLASS__.'@postSomeAction'));
        });


        Route::group(array(), function() {

            #Route::any('/ajax/send-message', array('as' => 'ajax.send-message', 'uses' => __CLASS__.'@postSendMessage'));
            #Route::any('/ajax/some-action', array('as' => 'ajax.some-action', 'uses' => __CLASS__.'@postSomeAction'));
        });
    }


    /****************************************************************************/


	public function __construct(){
        #
	}


    public function appProject($lang, $slug) {

        $project = Dic::valueBySlugs('projects', $slug, ['fields', 'textfields']);
        #Helper::tad($project);

        if (!$project)
            App::abort(404);

        $project = DicLib::loadImages($project, ['image']);

        $project_page = Page::by_id($project->page_id);
        #Helper::tad($project_page);

        if (!$project_page)
            App::abort(404);

        $prev_project = null;
        $next_project = null;

        $prev_project = Dic::valuesBySlug('projects', function($query) use ($project) {
            $query->where('lft', '<', $project->lft);
            $query->orderBy('lft', 'ASC');
            $query->take(1);
        }, ['fields', 'textfields'], true, true, true);
        #Helper::ta($prev_project);

        $next_project = Dic::valuesBySlug('projects', function($query) use ($project) {
            $query->where('lft', '>', $project->lft);
            $query->orderBy('lft', 'ASC');
            $query->take(1);
        }, ['fields', 'textfields'], true, true, true);
        #Helper::tad($next_project);

        return View::make(Helper::layout('project'), compact('project', 'project_page', 'prev_project', 'next_project'));
    }


    public function postSendMessage() {

        if (!Request::ajax())
            App::abort(404);

        $json_request = ['status' => FALSE, 'responseText' => ''];
        $data = Input::all();

        $tpl = 'emails.feedback';
        if (View::exists($tpl)) {

            Mail::send($tpl, $data, function ($message) use ($data) {
                #$message->from(Config::get('mail.from.address'), Config::get('mail.from.name'));

                $from_email = Config::get('app.settings.main.feedback_from_email') ?: 'no@reply.ru';
                $from_name = Config::get('app.settings.main.feedback_from_name') ?: 'No-reply';

                $message->from($from_email, $from_name);
                $message->subject('Сообщение обратной связи');

                $email = Config::get('app.settings.main.feedback_address') ?: 'dev@null.ru';
                $emails = array();
                if (strpos($email, ',')) {
                    $emails = explode(',', $email);
                    foreach ($emails as $e => $email) {
                        $email = trim($email);
                        if (filter_var($email, FILTER_VALIDATE_EMAIL))
                            $emails[$e] = $email;
                    }
                    $email = array_shift($emails);
                }

                $message->to($email);

                #$ccs = Config::get('mail.feedback.cc');
                $ccs = $emails;
                if (isset($ccs) && is_array($ccs) && count($ccs))
                    foreach ($ccs as $cc)
                        $message->cc($cc);

                /**
                 * Прикрепляем файл
                 */
                /*
                if (Input::hasFile('file') && ($file = Input::file('file')) !== NULL) {
                    #Helper::dd($file->getPathname() . ' / ' . $file->getClientOriginalName() . ' / ' . $file->getClientMimeType());
                    $message->attach($file->getPathname(), array('as' => $file->getClientOriginalName(), 'mime' => $file->getClientMimeType()));
                }
                #*/

            });
            $json_request['status'] = TRUE;

        } else {

            $json_request['responseText'] = 'Template ' . $tpl . ' not found.';
        }

        #Helper::dd($result);
        return Response::json($json_request, 200);
    }


}