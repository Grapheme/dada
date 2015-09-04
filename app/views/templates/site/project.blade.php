<?
/**
 * TITLE: Страница проекта
 * AVAILABLE_ONLY_IN_ADVANCED_MODE
 */
?>
@extends(Helper::layout())
<?php
#Helper::tad($project);
$image = $project->image;
$seo = $project->seo;
$page_title = $project->project_name;
?>


@section('style')
@stop


@section('body_class', 'project-body')


@section('content')

    <main class="main">
        <div class="project">
            <div style="background-image: url({{ is_object($image) ? $image->full() : '' }});" class="project__header white-font">
                <div class="header__content">
                    <div class="wrapper">
                        <div class="content-wrap">
                            <div class="project-title">{{ $project->project_name }}</div>
                            <div class="project-desc">{{ nl2br($project->short) }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="project-sections">

                {{ $project_page->draw_blocks() }}

            </div>
            <div class="project__footer">
                <div class="wrapper">
                    <a href="#" class="us-btn"><span>{{ trans("interface.button_contact_us") }}</span></a>
                    <div class="footer__nav">
                        <a href="#" class="nav__link"><span class="svg-font icon-arrow_up"></span></a>
                        @if (count_($prev_project))
                            @foreach ($prev_project as $prev_project)
                                <a href="{{ URL::route('app.project', [$prev_project->slug]) }}" class="nav__link"><span class="svg-font icon-arrow2_left"></span></a>
                            @endforeach
                        @endif
                        @if (count_($next_project))
                            @foreach ($next_project as $next_project)
                                <a href="{{ URL::route('app.project', [$next_project->slug]) }}" class="nav__link"><span class="svg-font icon-arrow2_right"></span></a>
                            @endforeach
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </main>

@stop


@section('scripts')
@stop