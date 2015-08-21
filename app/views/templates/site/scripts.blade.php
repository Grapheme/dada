<?
/**
 * TEMPLATE_IS_NOT_SETTABLE
 */
?>
<?
$types = [];
foreach ($dic_types as $type)
    $types[$type->id] = $type->field('type_name');

$projects = [];
foreach ($dic_projects as $project) {

    #Helper::tad($project);
    $page = $project->page_id;
    $page = Page::by_id($page);
    #Helper::tad($page);

    if (!is_object($page))
        continue;

    $image = $project->field('image');
    #Helper::tad($image);

    $projects[$project->id] = [
        'name' => $project->field('project_name'),
        'type_id' => $project->project_type_id,
        'url' => URL::route('page', $page->slug),
        'image' => is_object($image) ? $image->full() : null,
    ];
}
?>
<script>
    var __SITE__ = {};
    __SITE__.types = {{ json_encode($types, JSON_UNESCAPED_UNICODE) }};
    __SITE__.projects = {{ json_encode($projects, JSON_UNESCAPED_UNICODE) }};
</script>

{{ HTML::scriptmod(Config::get('site.theme_path').'/scripts/vendor.js') }}
{{ HTML::scriptmod(Config::get('site.theme_path').'/scripts/main.concat.js') }}